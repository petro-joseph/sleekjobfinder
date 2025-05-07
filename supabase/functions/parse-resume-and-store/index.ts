// @deno-types="https://deno.land/x/types/index.d.ts"
// supabase/functions/parse-resume-and-store/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts'; // Assuming you have this for CORS
// For text extraction from PDF/DOCX
import PDFParser from 'https://esm.sh/pdf2json@3.1.4';
import { Document } from 'https://esm.sh/docx@9.5.0';
// --- Helper: Text Extraction ---
async function extractTextFromFile(fileBuffer, fileName) {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    try {
        if (fileExtension === 'pdf') {
            // Initialize pdf2json
            const pdfParser = new PDFParser();
            // Return a promise to handle the async parsing
            return new Promise((resolve, reject) => {
                pdfParser.on('pdfParser_dataError', (errData) => {
                    console.error(`PDF parsing error for ${fileName}:`, errData);
                    reject(errData);
                });
                pdfParser.on('pdfParser_dataReady', (pdfData) => {
                    // Extract text from pdfData
                    let text = '';
                    if (pdfData?.Pages) {
                        pdfData.Pages.forEach((page) => {
                            if (page.Texts) {
                                page.Texts.forEach((textObj) => {
                                    if (textObj.R && textObj.R.length > 0) {
                                        text += decodeURIComponent(textObj.R[0].T) + ' ';
                                    }
                                });
                            }
                        });
                    }
                    resolve(text.trim() || null);
                });
                // Parse the PDF buffer directly as Uint8Array
                pdfParser.parseBuffer(new Uint8Array(fileBuffer));
            });
        } else if (fileExtension === 'docx') {
            const doc = await Document.fromArchive(new Uint8Array(fileBuffer));
            const paragraphs = doc.getParagraphs();
            if (paragraphs.length === 0) {
                console.warn(`No paragraphs found in DOCX file: ${fileName}`);
                return null;
            }
            const text = paragraphs.map((p) => p.getText()).join('\n');
            return text;
        } else if (fileExtension === 'txt') {
            return new TextDecoder().decode(fileBuffer);
        }
        console.warn(`Unsupported file type for text extraction: ${fileExtension}`);
        return null;
    } catch (error) {
        console.error(`Error extracting text from ${fileName}:`, error);
        return null;
    }
}
// --- Helper Functions ---
function extractStoragePathFromUrl(url) {
    try {
        const urlObj = new URL(url);
        let pathParts = urlObj.pathname.split('/').map((part) => decodeURIComponent(part));
        // Handle double-encoded %2520 explicitly
        const decodedPath = pathParts.join('/').replace(/%2520/g, '%20');
        pathParts = decodedPath.split('/');
        const objectIndex = pathParts.findIndex((part) => part === 'object');
        if (objectIndex !== -1) {
            const bucketIndex = pathParts.indexOf('cv-bucket', objectIndex);
            if (bucketIndex !== -1 && pathParts.length > bucketIndex + 1) {
                return decodeURIComponent(pathParts.slice(bucketIndex + 1).join('/'));
            }
        }
        const directBucketIndex = pathParts.indexOf('cv-bucket');
        if (directBucketIndex !== -1 && pathParts.length > directBucketIndex + 1) {
            return decodeURIComponent(pathParts.slice(directBucketIndex + 1).join('/'));
        }
        console.error('Could not extract storage path from URL:', url);
        return null;
    } catch (e) {
        console.error('Invalid file_path URL:', url, e);
        return null;
    }
}
// --- Helper: SuperParser API Call (Illustrative) ---
async function parseWithSuperParser(fileBuffer, fileName, apiKey) {
    console.log(`Attempting parsing with SuperParser for ${fileName}`);
    const formData = new FormData();
    formData.append('file', new Blob([
        fileBuffer
    ]), fileName);
    try {
        const response = await fetch('https://api.superparser.com/v1/parse', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('SuperParser API Error:', response.status, errorBody);
            return null;
        }
        const parsed = await response.json();
        const mappedData = {
            parser_used: 'superparser',
            parsed_at: new Date().toISOString(),
            personal: {
                full_name: parsed.candidate_info?.name || null,
                email: parsed.candidate_info?.email || null,
                phone: parsed.candidate_info?.phone || null,
                linkedin_url: parsed.candidate_info?.linkedin || null,
                website: parsed.candidate_info?.website || null,
                location_string: parsed.candidate_info?.location || null,
                summary_bio: parsed.summary || null
            },
            education: (parsed.education_history || []).map((edu) => ({
                institution: edu.institution_name || null,
                degree: edu.degree_name || null,
                field_of_study: edu.major || null,
                start_date: edu.start_date || null,
                end_date: edu.end_date || null,
                description: edu.details || null
            })),
            experience: (parsed.work_experience || []).map((exp) => ({
                title: exp.job_title || null,
                company: exp.company_name || null,
                location: exp.location || null,
                start_date: exp.start_date || null,
                end_date: exp.end_date || null,
                summary: exp.summary || null,
                achievements: exp.bullet_points || [],
                job_type: exp.employment_type || null
            })),
            skills: parsed.skills || [],
            raw_text: parsed.full_text || undefined
        };
        return mappedData;
    } catch (error) {
        console.error('Error calling SuperParser:', error);
        return null;
    }
}
// --- Helper: OpenAI GPT API Call (Illustrative) ---
async function parseWithOpenAI(text, apiKey) {
    console.log('Attempting parsing with OpenAI GPT');
    const openAiPrompt = `
    Parse the following resume text and extract the information into a JSON object.
    The JSON object must strictly follow this structure:
    {
      "personal": {
        "full_name": "string | null",
        "email": "string | null",
        "phone": "string | null",
        "linkedin_url": "string | null",
        "website": "string | null",
        "location_string": "string | null (e.g., City, Country)",
        "summary_bio": "string | null (a brief summary or objective from the resume)"
      },
      "education": [
        {
          "institution": "string | null",
          "degree": "string | null",
          "field_of_study": "string | null",
          "start_date": "string | null (YYYY-MM format)",
          "end_date": "string | null (YYYY-MM format or 'Present')",
          "description": "string | null (e.g., GPA, honors, relevant coursework)"
        }
      ],
      "experience": [
        {
          "title": "string | null",
          "company": "string | null",
          "location": "string | null",
          "start_date": "string | null (YYYY-MM format)",
          "end_date": "string | null (YYYY-MM format or 'Present')",
          "summary": "string | null (a brief summary of the role)",
          "achievements": ["string"],
          "job_type": "string | null (e.g., Full-time, Contract)"
        }
      ],
      "skills": ["string"]
    }

    If a field is not found, use null for single string fields or an empty array for array fields.
    For dates, use YYYY-MM format. If only year is available, use YYYY-01. If currently working/studying, use "Present" for end_date.
    Ensure achievements are a list of strings.

    Resume Text:
    """
    ${text}
    """

    JSON Output:
  `;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: openAiPrompt
                    }
                ],
                temperature: 0.2,
                response_format: {
                    type: "json_object"
                }
            })
        });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('OpenAI API Error:', response.status, errorBody);
            return null;
        }
        const result = await response.json();
        const jsonString = result.choices[0]?.message?.content;
        if (!jsonString) {
            console.error('OpenAI did not return content.');
            return null;
        }
        let parsedJson;
        try {
            parsedJson = JSON.parse(jsonString);
        } catch (e) {
            console.error('OpenAI returned invalid JSON:', e, jsonString);
            return null;
        }
        if (!parsedJson.personal || !Array.isArray(parsedJson.education) || !Array.isArray(parsedJson.experience) || !Array.isArray(parsedJson.skills)) {
            console.error('OpenAI JSON structure mismatch:', parsedJson);
            return null;
        }
        const mappedData = {
            parser_used: 'openai',
            parsed_at: new Date().toISOString(),
            personal: parsedJson.personal,
            education: parsedJson.education,
            experience: parsedJson.experience,
            skills: parsedJson.skills,
            raw_text: text
        };
        return mappedData;
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return null;
    }
}
// --- Helper: Internal Basic Parser (Fallback) ---
function parseInternally(text) {
    console.log('Attempting internal basic parsing');
    const personal = {
        full_name: null,
        email: text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)?.[0] || null,
        phone: null,
        linkedin_url: text.match(/(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi)?.[0] || null,
        website: null,
        location_string: null,
        summary_bio: null
    };
    const skillsKeywords = [
        'javascript',
        'react',
        'node',
        'python',
        'java',
        'sql',
        'aws',
        'docker',
        'kubernetes',
        'typescript'
    ];
    const foundSkills = new Set();
    const lowerText = text.toLowerCase();
    skillsKeywords.forEach((skill) => {
        if (lowerText.includes(skill)) {
            foundSkills.add(skill.charAt(0).toUpperCase() + skill.slice(1));
        }
    });
    return {
        parser_used: 'internal',
        parsed_at: new Date().toISOString(),
        personal: personal,
        education: [],
        experience: [],
        skills: Array.from(foundSkills),
        raw_text: text
    };
}
// --- Main Function Logic ---
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: corsHeaders
        });
    }
    let supabaseAdminClient;
    try {
        const { resume_id } = await req.json();
        if (!resume_id) {
            return new Response(JSON.stringify({
                error: 'Missing resume_id'
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 400
            });
        }
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        if (!supabaseUrl || !serviceRoleKey) {
            console.error('Missing Supabase credentials in environment variables');
            return new Response(JSON.stringify({
                error: 'Server configuration error: Supabase credentials missing'
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 500
            });
        }
        supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey);
        const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
        const superParserApiKey = Deno.env.get('SUPERPARSER_API_KEY');
        if (!openAIApiKey && !superParserApiKey) {
            console.error("Missing API keys for OpenAI and SuperParser");
            return new Response(JSON.stringify({
                error: 'Server configuration error: API keys missing.'
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 500
            });
        }
        // Fetch the resume record
        const { data: resumeRecord, error: fetchError } = await supabaseAdminClient.from('resumes').select('id, user_id, file_path, name').eq('id', resume_id).single();
        if (fetchError || !resumeRecord) {
            console.error('Error fetching resume record or not found:', fetchError);
            return new Response(JSON.stringify({
                error: `Resume not found or fetch error: ${fetchError?.message}`
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 404
            });
        }
        if (!resumeRecord.file_path || !resumeRecord.name) {
            console.error('Resume record is missing file_path or name:', resumeRecord);
            return new Response(JSON.stringify({
                error: 'Resume record incomplete (missing file_path or name).'
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 400
            });
        }
        // Extract storage path using the improved function
        const storagePath = extractStoragePathFromUrl(resumeRecord.file_path);
        if (!storagePath) {
            const failedParseData = {
                parser_used: 'failed',
                parsed_at: new Date().toISOString(),
                personal: null,
                education: [],
                experience: [],
                skills: [],
                error_message: `Failed to extract valid storage path from URL: ${resumeRecord.file_path}`
            };
            await supabaseAdminClient.from('resumes').update({
                parsed_data: failedParseData
            }).eq('id', resume_id);
            return new Response(JSON.stringify({
                error: 'Invalid file path format',
                parsed_data: failedParseData
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 400
            });
        }
        console.log('Attempting to download file from path:', storagePath);
        // Download file with better error handling
        const { data: fileData, error: downloadError } = await supabaseAdminClient.storage.from('cv-bucket').download(storagePath);
        if (downloadError || !fileData) {
            console.error('Storage download error:', downloadError);
            const failedParseData = {
                parser_used: 'failed',
                parsed_at: new Date().toISOString(),
                personal: null,
                education: [],
                experience: [],
                skills: [],
                error_message: `Failed to download from storage: ${downloadError?.message || 'Unknown error'}, Path: ${storagePath}`
            };
            await supabaseAdminClient.from('resumes').update({
                parsed_data: failedParseData
            }).eq('id', resume_id);
            return new Response(JSON.stringify({
                error: `Failed to download resume: ${downloadError?.message}`,
                parsed_data: failedParseData
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 500
            });
        }
        const fileBuffer = await fileData.arrayBuffer();
        const fileName = resumeRecord.name;
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        let parsedResult = null;
        let textContent = null;
        // Extract text from file first to ensure we have content regardless of parsing method
        textContent = await extractTextFromFile(fileBuffer, fileName);
        if (!textContent) {
            const failedParseData = {
                parser_used: 'failed',
                parsed_at: new Date().toISOString(),
                personal: null,
                education: [],
                experience: [],
                skills: [],
                error_message: `Failed to extract text from ${fileExtension} file`
            };
            await supabaseAdminClient.from('resumes').update({
                parsed_data: failedParseData
            }).eq('id', resume_id);
            return new Response(JSON.stringify({
                error: 'Text extraction failed',
                parsed_data: failedParseData
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 400
            });
        }
        // Try SuperParser for PDF/DOCX
        if ((fileExtension === 'pdf' || fileExtension === 'docx') && superParserApiKey) {
            try {
                parsedResult = await parseWithSuperParser(fileBuffer, fileName, superParserApiKey);
                // Add raw text if available
                if (parsedResult && textContent) {
                    parsedResult.raw_text = textContent;
                }
            } catch (error) {
                console.error('SuperParser error:', error);
                // Continue to next method
            }
        }
        // Try OpenAI if SuperParser failed or wasn't applicable
        if ((!parsedResult || !parsedResult.personal?.full_name) && openAIApiKey && textContent) {
            try {
                parsedResult = await parseWithOpenAI(textContent, openAIApiKey);
            } catch (error) {
                console.error('OpenAI parsing error:', error);
                // Continue to fallback
            }
        }
        // Fallback to internal parser
        if (!parsedResult && textContent) {
            parsedResult = parseInternally(textContent);
            parsedResult.raw_text = textContent;
        }
        // Final fallback if all parsing methods failed
        if (!parsedResult) {
            parsedResult = {
                parser_used: 'failed',
                parsed_at: new Date().toISOString(),
                personal: null,
                education: [],
                experience: [],
                skills: [],
                error_message: 'All parsing methods failed',
                raw_text: textContent || undefined
            };
        }
        // Update resume record with parsed data
        const { error: updateError } = await supabaseAdminClient.from('resumes').update({
            parsed_data: parsedResult
        }).eq('id', resume_id);
        if (updateError) {
            console.error('Error updating resume with parsed data:', updateError);
            return new Response(JSON.stringify({
                error: `Failed to update resume: ${updateError.message}`
            }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
                status: 500
            });
        }
        console.log(`Resume ${resume_id} processed. Parser: ${parsedResult?.parser_used}`);
        return new Response(JSON.stringify({
            success: true,
            message: 'Resume processed successfully',
            parsed_data: parsedResult,
            resumeId: resume_id,
            parserUsed: parsedResult?.parser_used
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            },
            status: 200
        });
    } catch (error) {
        console.error('Main function error:', error);
        if (supabaseAdminClient && req.method !== 'OPTIONS') {
            try {
                const body = await req.json().catch(() => ({}));
                const resume_id = body.resume_id;
                if (resume_id) {
                    const failedParseData = {
                        parser_used: 'failed',
                        parsed_at: new Date().toISOString(),
                        personal: null,
                        education: [],
                        experience: [],
                        skills: [],
                        error_message: `Edge function exception: ${error.message || 'Unknown error'}`
                    };
                    await supabaseAdminClient.from('resumes').update({
                        parsed_data: failedParseData
                    }).eq('id', resume_id);
                }
            } catch (dbError) {
                console.error("Failed to update DB on main error:", dbError);
            }
        }
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Internal server error'
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            },
            status: 500
        });
    }
});

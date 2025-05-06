
export interface ParsedEducation {
    institution: string | null;
    degree: string | null;
    field_of_study: string | null;
    start_date: string | null; // YYYY-MM
    end_date: string | null;   // YYYY-MM or "Present"
    description: string | null;
}

export interface ParsedExperience {
    title: string | null;
    company: string | null;
    location: string | null;
    start_date: string | null; // YYYY-MM
    end_date: string | null;   // YYYY-MM or "Present"
    summary: string | null;    // Overall role summary
    achievements: string[]; // Bullet points/responsibilities
    job_type: string | null;
}

export interface ParsedPersonalData {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    linkedin_url: string | null;
    website: string | null;
    location_string: string | null; // e.g., "City, Country"
    summary_bio: string | null;    // Extracted from a summary/objective section
}

export interface ParsedResumeDbData {
    parser_used: 'openai' | 'superparser' | 'internal' | 'failed' | 'unsupported_format';
    parsed_at: string; // ISO timestamp
    personal: ParsedPersonalData | null;
    education: ParsedEducation[];
    experience: ParsedExperience[];
    skills: string[];
    raw_text?: string; // Optional: store the full extracted text
    error_message?: string; // If parsing failed
}

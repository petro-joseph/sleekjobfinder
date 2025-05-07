import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import ProfileSections from './profile/ProfileSections';
import EditModal from './profile/EditModal';
import { Linkedin, User, BookOpen, Briefcase, Wrench, Shield, Settings } from 'lucide-react';
import { getResumeWithParsedData } from '@/api/resumes';
import { ParsedResumeDbData } from '@/types/parsedResume';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isScrollingFromClick, setIsScrollingFromClick] = useState(false);
  const [isLoadingParsedData, setIsLoadingParsedData] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Petro Joseph",
    lastName: "Ghati",
    email: "josephaley67@gmail.com",
    phone: "+255-657-824-541",
    website: "https://linkedin.com/in/petroghati",
    bio: "Experienced software developer with a passion for building efficient systems. lorem ",
    location: "Tanzania",
    education: [
      {
        id: "1",
        school: "Arusha Technical College (ATC)",
        degree: "Bachelor of Computer Science",
        fieldOfStudy: "Computer Science",
        startDate: "2018-11",
        endDate: "2021-12",
        description: "GPA: 4.2",
      },
    ],
    experience: [
      {
        id: "1",
        title: "Software Developer",
        company: "UBX Tanzania Ltd",
        location: "Tanzania",
        startDate: "2022-06",
        endDate: "Present",
        summary: "Lead the design, development, and implementation of multiple management and payment systems for various authorities in Zanzibar, significantly improving operational efficiency.",
        description: `- Lead the design, development, and implementation of multiple management and payment systems for various authorities in Zanzibar, significantly improving operational efficiency key projects are:
- ZIDRAS: Tax collection system for Zanzibar Revenue Authorities (ZRA) which helped to increase tax collection by over 82%.
- SACCOSX System: Digitized operations for a local cooperative microfinance society, integrating with Umoja switch ATMs and mobile channels.
- ZIBS: Streamlined road-related payments for Zanzibar Road Transport and Safety Authority (ZARTSA).
- COLA Malipo: Simplified land-related transactions for the Commission of Land (COLA).
- ZPC Malipo: Centralized payments for Zanzibar Port Corporation (ZPC).
- Troubleshooting hardware and software issues, implemented new tools, and configured systems.
- Provided technical support for office equipment and local call center systems.
- Implemented and maintained network infrastructure, ensuring endpoint safety.
- Performed regular hardware and software inventories, user needs assessments, and performance tests.
- Collaborated with IT Administrator on IT project management and new tool implementation.
- Maintained data analysis and incident reports, ensuring accurate documentation and reporting.`,
      },
      {
        id: "2",
        title: "Deputy Head of ICT Department",
        company: "Northern College of Health and Allied Sciences",
        location: "Tanzania",
        startDate: "2021-12",
        endDate: "2022-06",
        description: `- Developed and optimized the college website.
- Used Microsoft Excel for data management and report generation.
- Managed IT infrastructure and supervised social media campaigns.
- Implemented security measures for the student management system, enhancing data protection and user trust.`,
      },
    ],
    skills: [
      "Strong analytical skills for data analysis and interpretation",
      "Proficient in creating dashboards and KPI reports",
      "Excellent communication and interpersonal skills",
      "Organized, self-directed, and results-oriented",
      "Proven leadership in guiding cross-functional teams",
      "Familiarity with cloud-based data platforms like AWS, Azure, or Google Cloud Platform",
      "Project management skills, with experience in coordinating and delivering data-driven projects on time and within budget",
      "Strong communication and collaboration skills, with the ability to explain complex data concepts to non-technical stakeholders",
      "A continuous learning mindset, with a commitment to staying up-to-date with the latest advancements in data analytics and related technologies",
      "Hardware maintenance",
      "Troubleshooting network infrastructure",
      "MS Office",
      "Google Workspace",
      "Data Studio",
      "Project Management",
      "Process Improvement",
      "Process Automation",
      "PHP",
      "C",
      "C++",
      "Java",
      "Python",
      "MS SQL",
      "SQL",
      "Oracle",
      "DNS",
      "JavaScript",
      "jQuery",
      "HTTP",
      "SSL",
      "HTML",
      "CSS",
      "Proficient in English and Swahili",
    ],
    jobPreferences: {
      locations: ["Tanzania"],
      jobTypes: ["Full-time"],
      industries: ["Technology"],
    },
  });

  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({
    personal: null,
    education: null,
    work: null,
    skills: null,
    employment: null,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const navHeight = 64; // h-11 (44px) + py-4 (16px)
  const topOffset = 64; // top-16 (64px)
  const extraSpace = 32; // Increased from 16px to 32px for more breathing room
  const totalOffset = navHeight + topOffset + extraSpace;

  // Load parsed data from primary resume if available
  useEffect(() => {
    const loadParsedData = async () => {
      if (!user?.resumes || user.resumes.length === 0) return;
      
      try {
        setIsLoadingParsedData(true);
        
        // Find the primary resume
        const primaryResume = user.resumes.find(r => r.isPrimary);
        if (!primaryResume) return;
        
        const { parsedData } = await getResumeWithParsedData(primaryResume.id);
        
        if (parsedData && parsedData.parser_used !== 'failed' && parsedData.parser_used !== 'unsupported_format') {
          updateProfileWithParsedData(parsedData);
        }
      } catch (error) {
        console.error('Error loading parsed resume data:', error);
        // Don't show error toast to user since this is background loading
      } finally {
        setIsLoadingParsedData(false);
      }
    };
    
    loadParsedData();
  }, [user?.resumes]);

  // Update profile data with parsed resume data
  const updateProfileWithParsedData = (parsedData: ParsedResumeDbData) => {
    setProfileData(prevData => {
      const newData = { ...prevData };
      
      // Update personal information if available
      if (parsedData.personal) {
        const personal = parsedData.personal;
        
        if (personal.full_name) {
          const nameParts = personal.full_name.split(' ');
          newData.firstName = nameParts[0] || prevData.firstName;
          newData.lastName = nameParts.slice(1).join(' ') || prevData.lastName;
        }
        
        if (personal.email) newData.email = personal.email;
        if (personal.phone) newData.phone = personal.phone;
        if (personal.linkedin_url) newData.website = personal.linkedin_url;
        if (personal.location_string) newData.location = personal.location_string;
        if (personal.summary_bio) newData.bio = personal.summary_bio;
      }
      
      // Update education
      if (parsedData.education && parsedData.education.length > 0) {
        newData.education = parsedData.education.map((edu, index) => ({
          id: `parsed-${index}`,
          school: edu.institution || 'Unknown Institution',
          degree: edu.degree || 'Degree',
          fieldOfStudy: edu.field_of_study || 'Field of Study',
          startDate: edu.start_date || '',
          endDate: edu.end_date || '',
          description: edu.description || '',
        }));
      }
      
      // Update experience
      if (parsedData.experience && parsedData.experience.length > 0) {
        newData.experience = parsedData.experience.map((exp, index) => ({
          id: `parsed-${index}`,
          title: exp.title || 'Job Title',
          company: exp.company || 'Company',
          location: exp.location || '',
          startDate: exp.start_date || '',
          endDate: exp.end_date || '',
          summary: exp.summary || '',
          description: exp.achievements.join('\n- ') || '',
        }));
      }
      
      // Update skills
      if (parsedData.skills && parsedData.skills.length > 0) {
        newData.skills = parsedData.skills;
      }
      
      return newData;
    });
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsScrollingFromClick(true);

    const element = document.getElementById(section);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - totalOffset,
        behavior: 'smooth',
      });
    }

    // Re-enable observer after scroll completes (approximated with a timeout)
    setTimeout(() => {
      setIsScrollingFromClick(false);
    }, 1000);
  };

  const handleEditClick = (section: string) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSection(null);
  };

  const handleSave = (section: string, updatedData: any) => {
    setProfileData((prev) => ({
      ...prev,
      [section === 'work' ? 'experience' : section]: updatedData,
    }));
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully`, {
      position: "top-center",
    });
  };


  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrollingFromClick) return;

        let highestSection = '';
        let highestRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            highestRatio = entry.intersectionRatio;
            highestSection = entry.target.id;
          }
        });

        if (highestSection) {
          setActiveSection(highestSection);
        }
      },
      {
        root: null,
        rootMargin: `-${totalOffset}px 0px -40% 0px`,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    Object.keys(sectionRefs.current).forEach((section) => {
      const element = sectionRefs.current[section];
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      Object.keys(sectionRefs.current).forEach((section) => {
        const element = sectionRefs.current[section];
        if (element) {
          observerRef.current?.unobserve(element);
        }
      });
    };
  }, [isScrollingFromClick, totalOffset]);

  if (!user) return null;

  const navItems = [
    { label: 'Personal', section: 'personal', icon: User },
    { label: 'Education', section: 'education', icon: BookOpen },
    { label: 'Work Experience', section: 'work', icon: Briefcase },
    { label: 'Skills', section: 'skills', icon: Wrench },
    { label: 'Equal Employment', section: 'employment', icon: Shield },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your personal information and job preferences
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              onClick={() => navigate('/preferences')}
              variant="default"
              className="h-11 px-6 rounded-xl shadow-md transition-all text-sm font-medium"
            >
              <Settings className="mr-2 h-5 w-5" />
              JOB PREFERENCES
            </Button>

          </div>
        </div>

        {/* Navigation */}
        <div className="bg-background border-b border-border shadow-lg backdrop-blur-sm bg-opacity-90 mb-6 sticky top-16 z-10">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex overflow-x-auto gap-3 no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.section}
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavClick(item.section)}
                    className={`h-11 px-5 rounded-xl bg-background border-border shadow-sm transition-all text-sm font-medium flex items-center min-w-[140px] truncate ${activeSection === item.section
                        ? 'border-primary text-primary hover:bg-secondary/50'
                        : 'text-muted-foreground hover:bg-secondary/50'
                      }`}
                  >
                    <Icon className="mr-2 h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 pt-6">
          {/* Profile Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {profileData.firstName} {profileData.lastName}
                {isLoadingParsedData && <span className="ml-2 text-xs text-muted-foreground">(Loading resume data...)</span>}
              </h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span>{profileData.email}</span>
                <span>{profileData.phone}</span>
                <span className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </span>
              </div>
            </div>

            {/* Sections */}
            <ProfileSections
              user={profileData}
              onEditClick={handleEditClick}
              sectionRefs={sectionRefs}
              navOffset={totalOffset}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-64 flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full text-sm"
              onClick={() => navigate('/manage-resumes')}
            >
              Manage My Resume
            </Button>
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => handleEditClick('linkedin')}
            >
              Update LinkedIn URL
            </Button>
            <Button variant="default" className="w-full text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
              Install Extension
            </Button>
          </div>
        </div>

        {/* Edit Modal */}
        <EditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          section={editingSection}
          user={profileData}
          onSave={handleSave}
        />
      </div>
    </Layout>
  );
};

export default ProfilePage;


import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import ProfileSections from './profile/ProfileSections';
import EditModal from './profile/EditModal';
import { Linkedin, User, BookOpen, Briefcase, Wrench, Shield, Settings, Loader2 } from 'lucide-react';
import { getResumeWithParsedData } from '@/api/resumes';
import { ParsedResumeDbData } from '@/types/parsedResume';
import { fetchUserProfile, updateUserProfile } from '@/api/profiles';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [isScrollingFromClick, setIsScrollingFromClick] = useState(false);
  const [isLoadingParsedData, setIsLoadingParsedData] = useState(false);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    website: "",
    bio: "",
    location: "",
    education: [],
    experience: [],
    skills: [],
    jobPreferences: {
      locations: [],
      jobTypes: [],
      industries: [],
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

  const navHeight = 64; 
  const topOffset = 64; 
  const extraSpace = 32; 
  const totalOffset = navHeight + topOffset + extraSpace;

  // Load profile and parsed resume data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingParsedData(true);
        
        // Fetch user profile from database
        const profileData = await fetchUserProfile(user.id);
        
        // Find if user has any resumes
        const hasResumes = user.resumes && user.resumes.length > 0;
        setHasUploadedResume(hasResumes);

        // Find primary resume if any
        const primaryResume = user.resumes?.find(r => r.isPrimary);
        let parsedData: ParsedResumeDbData | null = null;

        if (primaryResume) {
          const { parsedData: resumeParsedData } = await getResumeWithParsedData(primaryResume.id);
          parsedData = resumeParsedData;
        }

        // Update state with profile data
        setProfileData(prevData => {
          const newData = { ...prevData };
          
          // Set basic profile info from database
          newData.firstName = profileData.first_name || '';
          newData.lastName = profileData.last_name || '';
          newData.email = profileData.email || user.email || '';
          newData.phone = profileData.phone || '';
          newData.website = profileData.website || '';
          newData.bio = profileData.bio || '';
          newData.location = profileData.location || '';
          
          // Set job preferences if available
          if (profileData.job_preferences) {
            newData.jobPreferences = {
              locations: profileData.job_preferences.locations || [],
              jobTypes: profileData.job_preferences.job_types || [],
              industries: profileData.job_preferences.industries || []
            };
          }

          // Set skills if available
          if (profileData.skills && profileData.skills.length > 0) {
            newData.skills = profileData.skills;
          }
          
          // Update with parsed resume data if available
          if (parsedData && parsedData.parser_used !== 'failed' && parsedData.parser_used !== 'unsupported_format') {
            // Update personal information if available
            if (parsedData.personal) {
              const personal = parsedData.personal;
              
              // Only update if fields are empty or if parsed data exists
              if (personal.full_name && (!newData.firstName || !newData.lastName)) {
                const nameParts = personal.full_name.split(' ');
                newData.firstName = nameParts[0] || newData.firstName;
                newData.lastName = nameParts.slice(1).join(' ') || newData.lastName;
              }
              
              if (personal.email && !newData.email) newData.email = personal.email;
              if (personal.phone && !newData.phone) newData.phone = personal.phone;
              if (personal.linkedin_url && !newData.website) newData.website = personal.linkedin_url;
              if (personal.location_string && !newData.location) newData.location = personal.location_string;
              if (personal.summary_bio && !newData.bio) newData.bio = personal.summary_bio;
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
            if (parsedData.skills && parsedData.skills.length > 0 && (!newData.skills || newData.skills.length === 0)) {
              newData.skills = parsedData.skills;
            }
          }
          
          return newData;
        });
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoadingParsedData(false);
      }
    };
    
    loadProfileData();
  }, [user?.id, user?.email, user?.resumes]);

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

    // Re-enable observer after scroll completes
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

  const handleSave = async (section: string, updatedData: any) => {
    try {
      if (!user?.id) {
        toast.error('User not authenticated');
        return;
      }

      // Update local state
      setProfileData((prev) => ({
        ...prev,
        [section === 'work' ? 'experience' : section]: updatedData,
      }));

      // Prepare data for API update
      let updatePayload: any = {};

      // Map section to database fields
      switch (section) {
        case 'personal':
          updatePayload = {
            first_name: updatedData.firstName,
            last_name: updatedData.lastName,
            email: updatedData.email,
            phone: updatedData.phone,
            website: updatedData.website,
            bio: updatedData.bio,
            location: updatedData.location,
          };
          break;
        
        case 'skills':
          updatePayload = { skills: updatedData };
          break;

        // Add cases for other sections as needed
        // For education and experience, you might need separate API endpoints
      }

      // Only call API if we have data to update
      if (Object.keys(updatePayload).length > 0) {
        await updateUserProfile(user.id, updatePayload);
      }

      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully`, {
        position: "top-center",
      });
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      toast.error(`Failed to save ${section} section`);
    }
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
    // { label: 'Equal Employment', section: 'employment', icon: Shield },
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
                {isLoadingParsedData ? (
                  <div className="flex items-center">
                    <span className="mr-2">Loading profile data</span>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <>
                    {profileData.firstName || 'Your'} {profileData.lastName || 'Profile'}
                  </>
                )}
              </h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                {profileData.email && <span>{profileData.email}</span>}
                {profileData.phone && <span>{profileData.phone}</span>}
                {profileData.website && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </span>
                )}
              </div>
            </div>

            {/* Sections */}
            <ProfileSections
              user={profileData}
              onEditClick={handleEditClick}
              sectionRefs={sectionRefs}
              navOffset={totalOffset}
              hasUploadedResume={hasUploadedResume}
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

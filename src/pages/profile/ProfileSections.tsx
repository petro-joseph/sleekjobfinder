import { Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileSectionsProps {
    user: any;
    onEditClick: (section: string) => void;
    sectionRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
    navOffset: number;
}

const ProfileSections: React.FC<ProfileSectionsProps> = ({ user, onEditClick, sectionRefs, navOffset }) => {
    return (
        <div className="space-y-8">
            {/* Personal Section */}
            <div
                id="personal"
                ref={(el) => (sectionRefs.current.personal = el)}
                style={{ scrollMarginTop: `${navOffset}px` }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                    <button onClick={() => onEditClick('personal')}>
                        <Edit className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                </div>
                <div className="space-y-2 text-sm text-foreground">
                    <p><span className="font-medium">First Name:</span> {user.firstName}</p>
                    <p><span className="font-medium">Last Name:</span> {user.lastName}</p>
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Phone:</span> {user.phone}</p>
                    <p><span className="font-medium">Bio:</span> {user.bio}</p>
                    <p><span className="font-medium">Location:</span> {user.location}</p>
                    <p><span className="font-medium">Website:</span> {user.website}</p>
                </div>
            </div>

            {/* Education Section */}
            <div
                id="education"
                ref={(el) => (sectionRefs.current.education = el)}
                style={{ scrollMarginTop: `${navOffset}px` }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Education</h2>
                    <button onClick={() => onEditClick('education')}>
                        <Edit className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                </div>
                <div className="relative">
                    {user.education.map((edu: any, index: number) => (
                        <div key={edu.id} className="flex gap-3 mb-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 flex items-center justify-center ">
                                    O
                                </div>
                                {index < user.education.length && (
                                    <div className="absolute top-6 left-3 w-0.5 h-[calc(100%-1.5rem)] bg-primary"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                                <h3 className="text-base font-semibold text-foreground">{edu.school}</h3>
                                <p className="text-sm text-foreground">{edu.degree}, {edu.fieldOfStudy}</p>
                                <p className="text-sm text-muted-foreground whitespace-normal">{edu.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Work Experience Section */}
            <div
                id="work"
                ref={(el) => (sectionRefs.current.work = el)}
                style={{ scrollMarginTop: `${navOffset}px` }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Work Experience</h2>
                    <button onClick={() => onEditClick('work')}>
                        <Edit className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                </div>
                <div className="relative">
                    {user.experience.map((exp: any, index: number) => (
                        <div key={exp.id} className="flex gap-3 mb-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    O
                                </div>
                                {index < user.experience.length && (
                                    <div className="absolute top-6 left-3 w-0.5 h-[calc(100%-1.5rem)] bg-primary"></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                                <h3 className="text-base font-semibold text-foreground">{exp.company}</h3>
                                <p className="text-sm text-foreground">{exp.title}</p>
                                {exp.summary && (
                                    <p className="text-sm text-muted-foreground mt-1 whitespace-normal break-words">
                                        {exp.summary}
                                    </p>
                                )}
                                {exp.description && (
                                    <ul className="list-disc list-outside ml-4 mt-1 text-sm text-muted-foreground">
                                        {exp.description.split('\n- ').map((item: string, bulletIndex: number) => (
                                            <li key={bulletIndex}>{item.replace('- ', '')}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Section */}
            <div
                id="skills"
                ref={(el) => (sectionRefs.current.skills = el)}
                style={{ scrollMarginTop: `${navOffset}px` }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Skills</h2>
                    <button onClick={() => onEditClick('skills')}>
                        <Edit className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill: string, index: number) => (
                        <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full px-3 py-1 text-muted-foreground border-border shadow-sm hover:bg-primary hover:text-for transition-all text-sm"
                        >
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Equal Employment Section */}
            <div
                id="employment"
                ref={(el) => (sectionRefs.current.employment = el)}
                style={{ scrollMarginTop: `${navOffset}px` }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Equal Employment</h2>
                    <button onClick={() => onEditClick('employment')}>
                        <Edit className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </button>
                </div>
                <div className="space-y-2 text-sm text-foreground">
                    <div className="flex justify-between">
                        <span>Are you authorized to work in the US?</span>
                        <span>{user.jobPreferences?.locations.includes('US') ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Do you have a disability?</span>
                        <span>No</span>
                    </div>
                    <div className="flex justify-between">
                        <span>What is your gender?</span>
                        <span>Male</span>
                    </div>
                    <div className="flex justify-between">
                        <span>How would you identify your race?</span>
                        <span>Black or African American</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSections;

import React from 'react';

interface SkillsDisplayProps {
  skills: string[];
  className?: string;
}

const SkillsDisplay: React.FC<SkillsDisplayProps> = ({ skills, className = '' }) => {
  const skillCategories = {
    Technical: skills.filter(skill =>
      ['Hardware maintenance', 'troubleshooting', 'network infrastructure', 'MS Office', 'Google Workspace', 'Data Studio'].includes(skill)
    ),
    Business: skills.filter(skill =>
      ['Project Management', 'Process Improvement', 'Process Automation'].includes(skill)
    ),
    'Programming Languages': skills.filter(skill =>
      ['PHP', 'C', 'C++', 'Java', 'Python', 'MS SQL', 'SQL', 'Oracle'].includes(skill)
    ),
    'Web Technologies': skills.filter(skill =>
      ['DNS', 'JavaScript', 'jQuery', 'HTTP', 'SSL', 'HTML', 'CSS'].includes(skill)
    ),
    Languages: skills.filter(skill =>
      ['Proficient in English and Swahili'].includes(skill)
    ),
    Other: skills.filter(skill => 
      !['Hardware maintenance', 'troubleshooting', 'network infrastructure', 'MS Office', 'Google Workspace', 'Data Studio',
        'Project Management', 'Process Improvement', 'Process Automation',
        'PHP', 'C', 'C++', 'Java', 'Python', 'MS SQL', 'SQL', 'Oracle',
        'DNS', 'JavaScript', 'jQuery', 'HTTP', 'SSL', 'HTML', 'CSS',
        'Proficient in English and Swahili'].includes(skill)
    )
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {Object.entries(skillCategories).map(([category, categorySkills]) =>
        categorySkills.length > 0 && (
          <p key={category} className="text-sm">
            <span className="font-semibold">{category}:</span> {categorySkills.join(', ')}
          </p>
        )
      )}
    </div>
  );
};

export default SkillsDisplay;

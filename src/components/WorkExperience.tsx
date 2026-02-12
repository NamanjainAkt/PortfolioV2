import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ChevronDown } from 'lucide-react';

interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

const experiences: Experience[] = [
  {
    id: 1,
    role: "Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    startMonth: "March",
    startYear: "2022",
    endMonth: "",
    endYear: "",
    isCurrent: true,
    description: "Leading development of scalable web applications and microservices architecture. Managing a team of 5 developers and collaborating with cross-functional teams to deliver high-impact features.",
    achievements: [
      "Led team of 5 developers in agile environment",
      "Improved application performance by 40% through optimization",
      "Implemented CI/CD pipeline reducing deployment time by 60%",
      "Architected microservices handling 1M+ daily requests"
    ],
    technologies: ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript"]
  },
  {
    id: 2,
    role: "Frontend Developer",
    company: "StartupXYZ",
    location: "New York, NY",
    startMonth: "June",
    startYear: "2020",
    endMonth: "February",
    endYear: "2022",
    isCurrent: false,
    description: "Developed customer-facing dashboard and improved overall UI/UX. Worked closely with design team to implement responsive interfaces and optimize user experience.",
    achievements: [
      "Built customer dashboard used by 50K+ users",
      "Reduced page load time by 35%",
      "Implemented real-time data visualization",
      "Created component library used across company"
    ],
    technologies: ["Vue.js", "Firebase", "JavaScript", "Chart.js", "Sass"]
  }
];

const WorkExperience: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExperience = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-20 md:py-32 bg-surface/30 border-y border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-mono text-accent-glow uppercase tracking-[0.3em] border border-accent-crimson/30 rounded-full bg-accent-crimson/5">
            Career Journey
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
            Work Experience
          </h2>
          <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto">
            My professional journey building impactful products
          </p>
        </motion.div>

        {/* Experience Cards - Accordion Style */}
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              className="bg-background border border-border rounded-xl overflow-hidden hover:border-accent-crimson/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              {/* Clickable Header */}
              <button
                onClick={() => toggleExperience(exp.id)}
                className="w-full p-6 md:p-8 text-left flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <h3 className="text-xl md:text-2xl font-bold">{exp.role}</h3>
                    
                    {/* Date */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent-crimson/10 rounded-full border border-accent-crimson/20 shrink-0">
                      <Calendar size={14} className="text-accent-crimson" />
                      <span className="text-sm font-mono text-accent-glow">
                        {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-secondary mb-4">
                    <span className="flex items-center gap-2">
                      <Briefcase size={16} className="text-accent-crimson" />
                      {exp.company}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={16} className="text-accent-crimson" />
                      {exp.location}
                    </span>
                  </div>

                  {/* Technologies - Always Visible */}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-sm bg-elevated text-secondary rounded-full border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 mt-1"
                >
                  <ChevronDown size={24} className="text-secondary" />
                </motion.div>
              </button>

              {/* Expandable Content */}
              <AnimatePresence initial={false}>
                {expandedId === exp.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-border pt-6">
                      {/* Description */}
                      <p className="text-secondary mb-6 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-tertiary mb-3">
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-secondary">
                              <span className="text-accent-crimson mt-1">▸</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Decorative element */}
        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-accent-crimson to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default WorkExperience;

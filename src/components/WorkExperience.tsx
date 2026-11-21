interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  period: string;
  isCurrent: boolean;
  achievements: string[];
  technologies: string[];
  type: string;
}

const experiences: Experience[] = [
  {
    id: 1,
    role: 'Full Stack Developer',
    company: 'Flick',
    location: 'Bhilai, Chhattisgarh · Remote',
    period: 'Nov 2025 — Present',
    isCurrent: true,
    type: 'Internship',
    achievements: [
      'Ship features end to end — React and TypeScript on the client, Node, Express and MongoDB behind it.',
      'Build the REST endpoints, then wire them into the interfaces that consume them.',
      'Work in a remote team with review on every change.',
    ],
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
  },
  {
    id: 2,
    role: 'MERN Stack Developer',
    company: 'Tellis Technologies',
    location: 'West Bengal, India · Remote',
    period: 'Nov 2025',
    isCurrent: false,
    type: 'Internship',
    achievements: [
      'Built MERN features end to end and designed the MongoDB schemas behind them.',
      'Integrated REST APIs with responsive React interfaces across internal products.',
      'Worked remotely with version control and code review.',
    ],
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js'],
  },
];

const WorkExperience = () => {
  return (
    <div className="border-t border-line">
      {experiences.map((exp) => (
        <article
          key={exp.id}
          className="grid gap-4 border-b border-line py-6 sm:grid-cols-[170px_1fr] sm:gap-8 sm:py-7"
        >
          <div>
            <p className="font-mono text-[11px] tracking-tight text-secondary">{exp.period}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-tertiary">
              {exp.type}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-tertiary">{exp.location}</p>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className="text-[15px] font-medium text-primary">{exp.role}</h3>
              <span className="text-sm text-secondary">@ {exp.company}</span>
              {exp.isCurrent && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-tertiary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                  Now
                </span>
              )}
            </div>

            <p className="mt-3 text-sm leading-relaxed text-secondary">{exp.achievements[0]}</p>

            <ul className="mt-3 space-y-1.5">
              {exp.achievements.slice(1).map((achievement) => (
                <li key={achievement} className="flex gap-2.5 text-[13px] leading-relaxed text-secondary">
                  <span className="mt-[7px] h-1 w-1 shrink-0 bg-tertiary" aria-hidden="true" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-tertiary">
              {exp.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default WorkExperience;

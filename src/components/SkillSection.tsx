const GROUPS = [
  {
    label: 'Frontend',
    items: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind',
      'React Native',
      'Vite',
      'Framer Motion',
      'HTML5',
      'CSS',
    ],
  },
  {
    label: 'Backend',
    items: [
      'Node.js',
      'Express',
      'REST APIs',
      'Prisma',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'GraphQL',
      'Firebase',
      'Supabase',
    ],
  },
  {
    label: 'Data & AI',
    items: ['OpenAI', 'Gemini', 'LangChain', 'Hugging Face', 'Python', 'FastAPI', 'Django'],
  },
  {
    label: 'Tooling',
    items: [
      'Git',
      'GitHub',
      'Docker',
      'Postman',
      'Vercel',
      'Expo',
      'Figma',
      'Linux',
      'Jest',
      'Cloudflare',
    ],
  },
  {
    label: 'AI Coding',
    items: ['Claude Code', 'OpenCode', 'Cursor', 'Antigravity', 'Gemini CLI'],
  },
];

const SkillSection = () => (
  <div className="divide-y divide-line border-y border-line">
    {GROUPS.map((group) => (
      <div
        key={group.label}
        className="grid gap-1.5 py-4 sm:grid-cols-[112px_1fr] sm:items-baseline sm:gap-6"
      >
        <p className="mono-label">{group.label}</p>
        <p className="text-[13px] leading-relaxed text-secondary">{group.items.join(' · ')}</p>
      </div>
    ))}
  </div>
);

export default SkillSection;

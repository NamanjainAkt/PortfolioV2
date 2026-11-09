import { TechIcon } from './TechIcon';

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
];

const AI_CODING = ['Claude Code', 'OpenCode', 'Cursor', 'Antigravity', 'Gemini CLI'];

const StackItem = ({ name }: { name: string }) => (
  <li className="group flex items-center gap-2.5 text-[13px] text-secondary transition-all duration-200 ease-smooth hover:translate-x-0.5 hover:text-primary">
    <TechIcon
      name={name}
      className="h-3.5 w-3.5 shrink-0 text-tertiary transition-colors duration-200 group-hover:text-primary"
    />
    <span className="truncate">{name}</span>
  </li>
);

const SkillSection = () => {
  return (
    <div className="border-l border-t border-line">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((group) => (
          <div key={group.label} className="border-b border-r border-line p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="mono-label">{group.label}</p>
              <span className="font-mono text-[10px] tabular-nums text-tertiary">
                {String(group.items.length).padStart(2, '0')}
              </span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <StackItem key={item} name={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-b border-r border-line p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="mono-label">AI Coding</p>
          <span className="font-mono text-[10px] tabular-nums text-tertiary">
            {String(AI_CODING.length).padStart(2, '0')}
          </span>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2.5">
          {AI_CODING.map((item) => (
            <StackItem key={item} name={item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SkillSection;

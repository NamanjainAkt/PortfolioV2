import {
  siReact,
  siTypescript,
  siNodedotjs,
  siExpress,
  siMongodb,
  siJavascript,
  siNextdotjs,
  siTailwindcss,
  siDocker,
  siGit,
  siGithub,
  siPostman,
  siVercel,
  siHtml5,
  siCss,
  siExpo,
  siGooglegemini,
  siPrisma,
  siVite,
  siFramer,
  siPostgresql,
  siRedis,
  siGraphql,
  siFirebase,
  siSupabase,
  siLangchain,
  siHuggingface,
  siPython,
  siFastapi,
  siDjango,
  siFigma,
  siLinux,
  siJest,
  siCloudflare,
} from 'simple-icons'

interface TechIconProps {
  name: string
  className?: string
}

type IconRenderer = (cn?: string) => JSX.Element

const fromSi = (icon: { path: string }): IconRenderer =>
  (cn) => (
    <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )

const icons: Record<string, IconRenderer> = {
  React: fromSi(siReact),
  TypeScript: fromSi(siTypescript),
  JavaScript: fromSi(siJavascript),
  'Node.js': fromSi(siNodedotjs),
  Express: fromSi(siExpress),
  MongoDB: fromSi(siMongodb),
  'Next.js': fromSi(siNextdotjs),
  Tailwind: fromSi(siTailwindcss),
  Docker: fromSi(siDocker),
  Git: fromSi(siGit),
  GitHub: fromSi(siGithub),
  Postman: fromSi(siPostman),
  Vercel: fromSi(siVercel),
  HTML5: fromSi(siHtml5),
  CSS: fromSi(siCss),
  Expo: fromSi(siExpo),
  Gemini: fromSi(siGooglegemini),
  Prisma: fromSi(siPrisma),
  Vite: fromSi(siVite),
  'Framer Motion': fromSi(siFramer),
  PostgreSQL: fromSi(siPostgresql),
  Redis: fromSi(siRedis),
  GraphQL: fromSi(siGraphql),
  Firebase: fromSi(siFirebase),
  Supabase: fromSi(siSupabase),
  LangChain: fromSi(siLangchain),
  'Hugging Face': fromSi(siHuggingface),
  Python: fromSi(siPython),
  FastAPI: fromSi(siFastapi),
  Django: fromSi(siDjango),
  Figma: fromSi(siFigma),
  Linux: fromSi(siLinux),
  Jest: fromSi(siJest),
  Cloudflare: fromSi(siCloudflare),

  'React Native': (cn) => (
    <svg
      className={cn}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </svg>
  ),

  'REST APIs': (cn) => (
    <svg
      className={cn}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8.5 6.5-5 5.5 5 5.5M15.5 6.5l5 5.5-5 5.5" />
    </svg>
  ),

  OpenAI: (cn) => (
    <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.6c.9 5.2 4.3 8.5 9.4 9.4-5.1.9-8.5 4.2-9.4 9.4-.9-5.2-4.3-8.5-9.4-9.4 5.1-.9 8.5-4.2 9.4-9.4Z" />
    </svg>
  ),
}

export const TechIcon = ({ name, className }: TechIconProps) => {
  const Icon = icons[name]
  if (!Icon) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
      </svg>
    )
  }
  return Icon(className)
}

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
  siExpo,
  siGooglegemini,
} from 'simple-icons'

interface TechIconProps {
  name: string
  className?: string
}

type IconRenderer = (cn?: string) => JSX.Element

const fromSi = (icon: { path: string; hex: string }): IconRenderer =>
  (cn) => (
    <svg className={cn} viewBox="0 0 24 24" fill="none">
      <path fill={`#${icon.hex}`} d={icon.path} />
    </svg>
  )

const icons: Record<string, IconRenderer> = {
  React: fromSi(siReact),
  TypeScript: fromSi(siTypescript),
  Nodejs: fromSi(siNodedotjs),
  'Node.js': fromSi(siNodedotjs),
  Express: fromSi(siExpress),
  MongoDB: fromSi(siMongodb),
  JavaScript: fromSi(siJavascript),
  Nextjs: fromSi(siNextdotjs),
  'Next.js': fromSi(siNextdotjs),
  Tailwind: fromSi(siTailwindcss),
  Docker: fromSi(siDocker),
  Git: fromSi(siGit),
  GitHub: fromSi(siGithub),
  Postman: fromSi(siPostman),
  Vercel: fromSi(siVercel),
  HTML5: fromSi(siHtml5),
  ReactNative: fromSi(siReact),
  Expo: fromSi(siExpo),
  Gemini: fromSi(siGooglegemini),
  Google: fromSi(siGooglegemini),

  VSCode: (cn) => <svg className={cn} viewBox="0 0 128 128" fill="none"><path fill="#007ACC" d="M12.7 49.7c-2.5-1.9-2.7-4.5-.5-6.4L22.2 34c2-1.8 5.2-1.9 7.5-.2l83.5 62c2.5 1.8 3.7 4.5 3.7 7.2v3.7c0 5.4-4.4 9.8-9.8 9.8H31.8c-4.5 0-8.5-2.4-10.6-6.2L12.7 49.7z"/><path fill="#007ACC" d="M12.7 78.3c-2.5 1.9-2.7 4.5-.5 6.4l10 9.3c2 1.8 5.2 1.9 7.5.2l83.5-62c2.5-1.8 3.7-4.5 3.7-7.2v-3.7c0-5.4-4.4-9.8-9.8-9.8H31.8c-4.5 0-8.5 2.4-10.6 6.2L12.7 78.3z"/><path fill="#fff" d="M22.2 94.3c-2-1.8-2-4.8 0-6.6l27-25.7c2-1.9 5.2-1.9 7.2 0l31.5 26.4c2 1.7 5.5.8 6.3-1.6l18.2-55.7"/></svg>,

  OpenAI: (cn) => <svg className={cn} viewBox="0 0 24 24" fill="none"><path fill="#74AA9C" d="M12 2.5c-2 0-3.5 1-4.2 2.7-.7-.2-1.4-.3-2.1-.2C4.2 5.3 3 6.4 2.5 8c-.5 1.6-.1 3.2 1 4.4-.7.6-1.1 1.4-1.2 2.3-.1 1.6.9 3.2 2.5 3.8.3.1.6.2.9.2.3 0 .6 0 .9-.1.6 1.7 2 2.9 3.9 2.9 1.1 0 2.1-.4 2.9-1.1.6.9 1.5 1.5 2.6 1.6 1.7.2 3.3-.9 3.9-2.5.1-.3.2-.6.2-.9 0-.7-.2-1.3-.6-1.9.9-.7 1.5-1.6 1.7-2.7.3-1.7-.5-3.3-2-4.2.1-.5.1-1 0-1.5-.3-1.7-1.7-3-3.5-3.1h-.5c-.1 0-.2 0-.3.1C14.8 3 13.5 2.5 12 2.5z"/></svg>,
}

export const TechIcon = ({ name, className }: TechIconProps) => {
  const Icon = icons[name]
  if (!Icon) return null
  return Icon(className)
}

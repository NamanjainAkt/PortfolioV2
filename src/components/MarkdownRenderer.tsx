import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import { Terminal } from 'lucide-react';
import type { Components } from 'react-markdown';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('python', python);

interface MarkdownRendererProps {
  content: string;
  components?: Components;
}

const defaultComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (match) {
      return (
        <div className="my-12 rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#0A0A0A]">
          <div className="bg-white/5 px-6 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <Terminal size={12} className="text-accent-crimson" />
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">{match[1]}</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/30" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
              <div className="w-2 h-2 rounded-full bg-green-500/30" />
            </div>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{ margin: 0, padding: '2rem', background: 'transparent' } as React.CSSProperties}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code className="px-1.5 py-0.5 rounded font-mono text-[0.9em] bg-accent-crimson/10 text-accent-crimson border border-accent-crimson/20" {...props}>
        {children}
      </code>
    );
  }
};

export const MarkdownRenderer = ({ content, components }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown components={{ ...defaultComponents, ...components }}>
      {content}
    </ReactMarkdown>
  );
};

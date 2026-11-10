import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Trash2, Sparkles, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content: "Hi, I'm **Ava**, Naman's portfolio assistant. Ask me about his projects, technical stack, or architecture background.",
  timestamp: new Date(),
};

const SUGGESTIONS = [
  "What's Naman's tech stack?",
  "Tell me about his key projects",
  "How can I reach out?",
];

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, scrollToBottom]);

  const handleSend = async (messageText: string) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-bot`,
          role: 'bot',
          content: data.reply || 'No response returned.',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Unable to connect to Ava right now.';
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-err`,
          role: 'bot',
          content: `*Error:* ${errorText}\n\nYou can reach Naman directly on the [Contact](/contact) page.`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-full border px-4 py-2.5 font-mono text-xs shadow-xl backdrop-blur-md transition-colors duration-200',
          isOpen
            ? 'border-line bg-primary text-background'
            : 'border-line bg-surface/90 text-primary hover:border-primary hover:bg-elevated'
        )}
        aria-label={isOpen ? 'Close chat with Ava' : 'Open chat with Ava'}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="tracking-wide">{isOpen ? 'Close' : 'Ask Ava'}</span>
        <Sparkles size={13} className={isOpen ? 'text-background' : 'text-secondary'} />
      </motion.button>

      {/* Chat Window Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-4 z-[70] flex h-[540px] max-h-[82vh] w-[calc(100vw-2rem)] sm:w-[420px] flex-col overflow-hidden rounded-xl border border-line bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-background text-primary">
                  <Bot size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">Ava</span>
                    <span className="font-mono text-[10px] text-tertiary">v2.5</span>
                  </div>
                  <span className="mono-label text-[10px]">AI Assistant</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded p-1.5 text-secondary hover:bg-elevated hover:text-primary transition-colors"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1.5 text-secondary hover:bg-elevated hover:text-primary transition-colors"
                  title="Close"
                  aria-label="Close chat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs sm:text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col',
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-primary text-background'
                        : msg.isError
                        ? 'border border-warning/30 bg-surface text-primary'
                        : 'border border-line bg-surface text-primary'
                    )}
                  >
                    {msg.role === 'bot' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed [&>p]:my-1.5 [&>ul]:my-1.5 [&>ul]:pl-4 [&>li]:my-0.5 [&_code]:font-mono [&_code]:text-[11px] [&_code]:bg-elevated [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_a]:text-primary [&_a]:underline">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  <span className="mt-1 px-1 font-mono text-[9px] text-tertiary">
                    {msg.role === 'user' ? 'You' : 'Ava'} •{' '}
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 rounded-lg border border-line bg-surface px-3 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary" />
                  </div>
                  <span className="mt-1 px-1 font-mono text-[9px] text-tertiary">Ava is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (shown when only initial message exists) */}
            {messages.length === 1 && (
              <div className="border-t border-line/60 bg-surface/50 px-3 py-2">
                <p className="mb-1.5 font-mono text-[10px] text-tertiary">Suggested questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSend(s)}
                      className="rounded border border-line bg-background px-2.5 py-1 text-[11px] text-secondary transition-colors hover:border-primary hover:text-primary text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border-t border-line bg-surface p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Ava anything..."
                  disabled={isLoading}
                  className="flex-1 rounded-md border border-line bg-background px-3 py-2 text-xs sm:text-sm text-primary placeholder:text-tertiary outline-none transition-colors focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                  aria-label="Send message"
                >
                  {isLoading ? <CornerDownLeft size={14} /> : <Send size={14} />}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-tertiary font-mono">
                <span>Press Enter to send</span>
                <span>Powered by Gemini</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

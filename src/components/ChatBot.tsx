import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Send, Bot, User, Sparkles, Command, Zap, Maximize2, Minimize2, Trash2, X, ChevronDown, MessageCircle, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: "Hello. I am **Aries**, your dedicated architectural assistant. I can provide technical specifications on Naman's stack, project methodologies, or facilitate a direct connection. \n\nWhat are we building today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, history }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.reply,
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "System link interrupted. Please verify your connection and re-initiate.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. THE TRIGGER: Minimalist Intelligence Pill */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-8 right-8 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-500",
          isOpen 
            ? "bg-white text-black ring-4 ring-white/10" 
            : "bg-[#0A0A0A] border border-white/10 text-white hover:border-accent-crimson/50"
        )}
      >
        <div className="relative">
          <Sparkles size={18} className={cn(isOpen ? "text-accent-crimson" : "text-white")} />
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-crimson"></span>
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
          {isOpen ? "Active Link" : "Ask Aries"}
        </span>
      </motion.button>

      {/* 2. THE INTERFACE: Glassmorphism 2.0 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
            className={cn(
              "fixed right-8 bottom-24 z-50 flex flex-col overflow-hidden bg-[#0A0A0A]/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.8)] rounded-[2rem]",
              isMaximized ? "inset-8 w-auto h-auto" : "w-[95vw] md:w-[420px] h-[600px] max-h-[80vh]"
            )}
          >
            {/* High-End Header */}
            <div className="relative px-6 py-5 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                   <div className="absolute inset-0 bg-accent-crimson/10 animate-pulse rounded-full" />
                   <Bot size={20} className="text-white relative z-10" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                    Aries Intelligence
                    <ShieldCheck size={12} className="text-accent-crimson" />
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-crimson" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Processing v2.4</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setMessages([messages[0]])}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                  title="Purge session"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 text-zinc-500 hover:text-white transition-colors hidden md:block"
                >
                  {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-500 hover:text-accent-crimson transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-2 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 text-sm leading-relaxed transition-all duration-300",
                    msg.role === 'user' 
                      ? "bg-white text-black rounded-2xl rounded-tr-none font-medium shadow-lg" 
                      : "bg-zinc-900/50 border border-white/5 text-zinc-300 rounded-2xl rounded-tl-none backdrop-blur-sm"
                  )}>
                    {msg.role === 'bot' ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-white prose-code:text-accent-crimson">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                    {msg.role === 'user' ? "User_Authorized" : "Aries_Response"} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex flex-col gap-2 items-start mr-auto">
                  <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1.5">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-accent-crimson rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-accent-crimson rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-accent-crimson rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Advanced Input Component */}
            <div className="p-6 bg-zinc-950/80 border-t border-white/5 backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Inquire about system architecture..."
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent-crimson/50 focus:ring-4 focus:ring-accent-crimson/5 transition-all"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 text-[10px] text-zinc-500 font-mono border border-white/5">
                    <Command size={10} />
                    <span>Enter</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="p-2.5 bg-white text-black rounded-lg hover:bg-accent-crimson hover:text-white disabled:opacity-20 transition-all shadow-xl"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-3">
                   <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-green-500" />
                      <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Encryption Active</span>
                   </div>
                </div>
                <div className="text-[9px] text-zinc-700 font-mono">
                  © 2026 NAMAN_INDUSTRIES
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(200, 16, 46, 0.3);
        }
      `}</style>
    </>
  );
};

export default ChatBot;

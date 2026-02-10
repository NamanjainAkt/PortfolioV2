import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: "Hi there! I'm Aries, Naman's AI assistant. Ask me anything about his projects, skills, or experience!",
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
    scrollToBottom();
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
      // Prepare history for API (exclude welcome message if needed, or map it correctly)
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          history 
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-accent-crimson text-white rounded-full shadow-[0_0_20px_rgba(200,16,46,0.4)] hover:shadow-[0_0_30px_rgba(200,16,46,0.6)] transition-all duration-300 group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:animate-pulse" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-elevated/50 backdrop-blur-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-crimson/10 flex items-center justify-center border border-accent-crimson/20">
                <Sparkles size={20} className="text-accent-crimson" />
              </div>
              <div>
                <h3 className="font-bold text-primary">Aries AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-secondary">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                    msg.role === 'user' ? "bg-primary text-background" : "bg-elevated border border-border text-accent-crimson"
                  )}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary text-background rounded-tr-none" 
                      : "bg-elevated border border-border text-secondary rounded-tl-none"
                  )}>
                    {msg.role === 'bot' ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-background prose-pre:border prose-pre:border-border">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    <span className="text-[10px] opacity-50 block mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-elevated border border-border text-accent-crimson flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} />
                  </div>
                  <div className="bg-elevated border border-border p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-secondary/50 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-surface">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-elevated border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-crimson/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2.5 bg-accent-crimson text-white rounded-xl hover:bg-accent-glow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
              <div className="text-center mt-2">
                <p className="text-[10px] text-tertiary">
                  AI can make mistakes. Please verify important info.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

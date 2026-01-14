
import React, { useState, useRef, useEffect } from 'react';
import { startDesignerChat } from '../geminiService';
import { ChatMessage, Product } from '../types';

interface DesignerChatProps {
  onNavigate: (view: any) => void;
  onProductSelect: (product: Product) => void;
}

const DesignerChat: React.FC<DesignerChatProps> = ({ onNavigate, onProductSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to FURNEXA. I am your personal design curator. How may I assist your space today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ 
        role: m.role, 
        parts: [{ text: m.text }] 
      }));
      const chat = startDesignerChat(history);
      const result = await chat.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text || '' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'I apologize, my connection to the studio is briefly interrupted.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 z-[100] font-sans">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-xl w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-stone-200 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-900 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-widest">FURNEXA AI Designer</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-stone-100 p-3 rounded-xl space-x-1 flex">
                  <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-stone-100">
            <div className="relative">
              <input 
                type="text"
                placeholder="Ask about style, products..."
                className="w-full bg-stone-50 border border-stone-200 rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-stone-900 outline-none pr-10"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className="absolute right-2 top-1.5 p-1 text-stone-400 hover:text-stone-900">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-stone-900 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute right-16 bg-stone-900 text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Design Help</span>
        </button>
      )}
    </div>
  );
};

export default DesignerChat;

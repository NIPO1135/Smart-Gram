import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const AITutor: React.FC = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'হ্যালো! আমি আপনার Smart Gram AI Tutor. আপনি কি নতুন কোনো স্কিল শিখতে চান? আমাকে যেকোনো প্রশ্ন করতে পারেন।'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai/tutor-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ messages: history })
      });

      const data = await res.json();
      if (res.ok && data.result?.text) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: data.result.text
        }]);
      } else {
        throw new Error(data.message || 'Error communicating with AI');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'দুঃখিত, কোনো একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden relative">
      {/* Header */}
      <div className="bg-indigo-600 p-4 shrink-0 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h3 className="text-white font-black text-lg leading-none mb-1">AI Tutor</h3>
          <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Always ready to help</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[85%] flex-row">
              <div className="w-8 h-8 rounded-full flex shrink-0 items-center justify-center bg-green-100 text-green-600">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-3 rounded-2xl text-sm leading-relaxed bg-white border border-gray-100 text-gray-400 shadow-sm rounded-tl-sm flex items-center gap-1">
                <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-white flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-50">
        <button 
          onClick={() => handleSend("দয়া করে বিষয়টি আরও সহজে বুঝিয়ে বলুন")}
          className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100 hover:bg-amber-100"
        >
          <Sparkles className="w-3 h-3" /> Explain সহজে
        </button>
        <button 
          onClick={() => handleSend("আমাকে এর আর কিছু উদাহরণ দিন")}
          className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100"
        >
          <BookOpen className="w-3 h-3" /> আরও উদাহরণ দিন
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center gap-2"
        >
          <button type="button" className="p-3 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200">
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default AITutor;

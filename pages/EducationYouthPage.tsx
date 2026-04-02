
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GoogleGenAI } from '@google/genai';
import { 
  ArrowLeft, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Briefcase, 
  Monitor, 
  Globe, 
  Search,
  Download,
  MessageSquare,
  Send,
  Loader2,
  ExternalLink,
  ChevronRight,
  Laptop
} from 'lucide-react';

const EducationYouthPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  
  // AI Career Mentor State
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = inputText;
    setInputText("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are a helpful Career Mentor for rural youth in Bangladesh. 
          Provide advice in ${language === 'bn' ? 'Bengali' : 'English'}. 
          Keep your answers encouraging, professional, and easy to understand for students.`,
        },
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "" }]);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsThinking(false);
    }
  };

  // Updated menu cards logic to match requested labels and icons
  const skillCourses = [
    { title: t.eduOnlineCourses, icon: Laptop, color: 'bg-blue-500', link: 'https://youtube.com/results?search_query=free+online+courses+bangladesh' },
    { title: t.eduJobNews, icon: Briefcase, color: 'bg-indigo-500', link: 'https://www.bdjobs.com/' },
    { title: t.eduScholarshipsLabel, icon: Globe, color: 'bg-emerald-500', link: 'https://education.gov.bd/' },
  ];

  const scholarships = [
    { 
      title: language === 'bn' ? 'জেলা পরিষদ বৃত্তি ২০২৪' : 'District Council Scholarship 2024', 
      deadline: language === 'bn' ? '৩০ নভেম্বর ২০২৪' : '30 Nov 2024',
      desc: language === 'bn' ? 'মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষার্থীদের জন্য' : 'For secondary and higher secondary students'
    },
    { 
      title: language === 'bn' ? 'শিক্ষা মন্ত্রণালয় বিশেষ অনুদান' : 'Education Ministry Special Grant', 
      deadline: language === 'bn' ? '১৫ ডিসেম্বর ২০২৪' : '15 Dec 2024',
      desc: language === 'bn' ? 'দরিদ্র ও মেধাবী শিক্ষার্থীদের জন্য' : 'For poor and meritorious students'
    },
    { 
      title: language === 'bn' ? 'প্রাইম ব্যাংক ফাউন্ডেশন বৃত্তি' : 'Prime Bank Foundation Scholarship', 
      deadline: language === 'bn' ? 'মেয়াদ শেষ' : 'Expired',
      desc: language === 'bn' ? 'উচ্চ শিক্ষার জন্য' : 'For higher education'
    },
  ];

  const jobOpenings = [
    { 
      title: language === 'bn' ? 'ডাটা এন্ট্রি অপারেটর' : 'Data Entry Operator', 
      company: language === 'bn' ? 'ইউনিয়ন তথ্য কেন্দ্র' : 'Union Information Center', 
      type: 'Part-time',
      location: language === 'bn' ? 'ইউনিয়ন পরিষদ' : 'Union Parishad'
    },
    { 
      title: language === 'bn' ? 'অফিস সহকারী' : 'Office Assistant', 
      company: language === 'bn' ? 'স্থানীয় সমবায় ব্যাংক' : 'Local Cooperative Bank', 
      type: 'Full-time',
      location: language === 'bn' ? 'গ্রাম' : 'Village'
    },
  ];

  return (
    <div className="min-h-screen bg-sky-50 pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-50 to-white px-4 pt-6 pb-5 sticky top-0 z-40 border-b-2 border-sky-200 shadow-sm">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={onBack} className="p-2 hover:bg-sky-100 rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-sky-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-sky-900">{t.eduTitle}</h2>
            <p className="text-xs text-gray-600 mt-1">
              {language === 'bn' ? 'শিক্ষা, দক্ষতা বৃদ্ধি এবং চাকরির সুযোগ' : 'Education, skills and job opportunities'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-8 max-w-2xl mx-auto">
        
        {/* Skill Development Grid - Fixed Layout with Labels */}
        <section>
          <div className="flex items-center space-x-2 mb-3 px-2">
            <Monitor className="text-sky-600 w-6 h-6" />
            <div>
              <h3 className="text-xl font-extrabold text-gray-800">{t.skillDev}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {language === 'bn' ? 'বিনামূল্যে শিখুন এবং দক্ষতা বৃদ্ধি করুন' : 'Learn for free and build skills'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {skillCourses.map((course, idx) => (
              <a 
                key={idx} 
                href={course.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-5 rounded-[2rem] border-2 border-sky-100 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all group flex flex-col items-center justify-center text-center space-y-3 active:scale-95"
              >
                <div className={`${course.color} p-5 rounded-2xl text-white group-hover:scale-110 transition-transform shadow-lg`}>
                  <course.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-bold text-gray-800 leading-tight">{course.title}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Scholarship Alerts */}
        <section>
          <div className="flex items-center space-x-2 mb-3 px-2">
            <Award className="text-sky-600 w-6 h-6" />
            <div>
              <h3 className="text-xl font-extrabold text-gray-800">{t.scholarships}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {language === 'bn' ? 'বিনামূল্যে পড়াশোনার সুযোগ' : 'Free education opportunities'}
              </p>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
            {scholarships.map((sch, idx) => (
              <div key={idx} className="flex-shrink-0 w-72 bg-gradient-to-br from-white to-sky-50 p-6 rounded-[2rem] border-2 border-sky-100 shadow-md snap-start">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="bg-sky-100 p-2.5 rounded-xl">
                    <Award className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-gray-800 text-base leading-tight mb-1">{sch.title}</h4>
                    <p className="text-xs text-gray-600">{sch.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-sky-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                      {language === 'bn' ? 'আবেদনের শেষ তারিখ' : 'Deadline'}
                    </p>
                    <span className={`text-sm font-bold ${sch.deadline === (language === 'bn' ? 'মেয়াদ শেষ' : 'Expired') ? 'text-red-600' : 'text-gray-700'}`}>
                      {sch.deadline}
                    </span>
                  </div>
                  <button className={`px-5 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all shadow-md ${
                    sch.deadline === (language === 'bn' ? 'মেয়াদ শেষ' : 'Expired')
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}>
                    {t.applyNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Digital Library */}
        <section>
          <div className="flex items-center space-x-2 mb-3 px-2">
            <BookOpen className="text-sky-600 w-6 h-6" />
            <div>
              <h3 className="text-xl font-extrabold text-gray-800">{t.digitalLibrary}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {language === 'bn' ? 'বিনামূল্যে বই ডাউনলোড করুন' : 'Download books for free'}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { title: t.nctbBooks, type: language === 'bn' ? '১ম থেকে ১০ম শ্রেণী' : 'Class 1-10', desc: language === 'bn' ? 'সরকারি পাঠ্যবই' : 'Government textbooks' },
              { title: t.gkBooks, type: language === 'bn' ? 'পিডিএফ সংস্করণ' : 'PDF Edition', desc: language === 'bn' ? 'সাধারণ জ্ঞান বই' : 'General knowledge books' }
            ].map((lib, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[2rem] border-2 border-sky-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="bg-sky-100 p-4 rounded-2xl group-hover:bg-sky-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-gray-800 text-base mb-1">{lib.title}</h4>
                    <p className="text-xs text-gray-600 font-medium mb-0.5">{lib.desc}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{lib.type}</p>
                  </div>
                </div>
                <button className="p-4 bg-sky-600 text-white hover:bg-sky-700 rounded-2xl transition-all active:scale-95 shadow-md ml-3">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* AI Career Mentor Chat */}
        <section className="bg-gradient-to-br from-white to-sky-50 rounded-[2.5rem] p-6 shadow-lg border-2 border-sky-200 flex flex-col h-[500px]">
          <div className="flex items-start space-x-3 mb-4">
            <div className="bg-gradient-to-br from-sky-600 to-sky-700 p-3 rounded-2xl text-white shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-extrabold text-gray-800 mb-1">{t.careerMentor}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{t.careerMentorDesc}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2 custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="bg-gradient-to-br from-sky-100 to-sky-200 p-6 rounded-full mb-5 shadow-inner">
                  <GraduationCap className="w-10 h-10 text-sky-600" />
                </div>
                <h4 className="text-base font-bold text-gray-700 mb-2">
                  {language === 'bn' ? 'ক্যারিয়ার পরামর্শ নিন' : 'Get Career Advice'}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  {t.careerPlaceholder}
                </p>
                <div className="mt-6 space-y-2 text-left max-w-xs">
                  <p className="text-xs text-gray-400">
                    {language === 'bn' ? '💡 উদাহরণ: "আমি কী পড়াশোনা করব?" বা "কোন চাকরিতে আবেদন করব?"' : '💡 Example: "What should I study?" or "Which job should I apply for?"'}
                  </p>
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-sky-600 text-white rounded-br-none shadow-md shadow-sky-600/10' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 p-4 rounded-3xl rounded-bl-none text-xs font-bold uppercase flex items-center space-x-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>{t.thinking}</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl p-2 border border-sky-50">
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none px-2 text-sm"
              placeholder={t.careerPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-sky-600 text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-sky-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Local Job Board */}
        <section>
          <div className="flex items-center space-x-2 mb-3 px-2">
            <Briefcase className="text-sky-600 w-6 h-6" />
            <div>
              <h3 className="text-xl font-extrabold text-gray-800">{t.jobBoard}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {language === 'bn' ? 'আপনার এলাকার চাকরির সুযোগ' : 'Job opportunities in your area'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {jobOpenings.map((job, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2.5rem] border-2 border-sky-100 shadow-md hover:shadow-lg group transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Briefcase className="w-4 h-4 text-sky-500" />
                      <h4 className="font-extrabold text-gray-800 text-base group-hover:text-sky-600 transition-colors">{job.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-1 mb-1">
                      {language === 'bn' ? 'সংস্থা:' : 'Company:'} <span className="text-gray-500">{job.company}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'bn' ? 'স্থান:' : 'Location:'} <span className="text-gray-600 font-medium">{job.location}</span>
                    </p>
                  </div>
                  <span className={`text-xs font-black px-4 py-2 rounded-full uppercase ${
                    job.type === 'Full-time' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {job.type === 'Full-time' 
                      ? (language === 'bn' ? 'পূর্ণকালীন' : 'Full-time')
                      : (language === 'bn' ? 'খণ্ডকালীন' : 'Part-time')}
                  </span>
                </div>
                <button className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center space-x-2 shadow-md active:scale-95">
                  <span>{t.viewDetails}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0f2fe; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default EducationYouthPage;

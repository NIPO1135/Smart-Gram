
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BellRing } from 'lucide-react';

const NoticeBoard: React.FC = () => {
  const { t, language } = useLanguage();

  // Simulated notices
  const notices = language === 'bn' 
    ? "গ্রামের সরকারি হাসপাতালে আগামী শুক্রবার বিনামূল্যে রক্ত পরীক্ষা করা হবে। | নতুন সার ভর্তুকির জন্য ইউনিয়ন পরিষদে যোগাযোগ করুন। | খেলাধুলা ক্লাবের পক্ষ থেকে আগামী রোববার ফুটবল টুনামেন্ট আয়োজন করা হবে।"
    : "Free blood checkups at the village government hospital next Friday. | Contact Union Parishad for new fertilizer subsidies. | Football tournament organized by the Sports Club this Sunday.";

  return (
    <div className="bg-white border-y border-green-100 py-2.5 flex items-center overflow-hidden">
      <div className="bg-green-600 text-white px-4 py-1.5 flex items-center space-x-2 z-10 font-bold text-xs uppercase tracking-wider ml-4 rounded-xl shadow-md">
        <BellRing className="w-3.5 h-3.5" />
        <span className="whitespace-nowrap">{t.noticeBoard}</span>
      </div>
      <div className="flex-1 overflow-hidden relative h-6 flex items-center ml-4">
        <div className="animate-marquee whitespace-nowrap text-sm text-green-800 font-semibold tracking-wide">
          {notices} — {notices}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NoticeBoard;

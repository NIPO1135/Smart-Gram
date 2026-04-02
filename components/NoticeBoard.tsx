
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppConfig } from '../context/AppConfigContext';
import { BellRing } from 'lucide-react';

const NoticeBoard: React.FC = () => {
  const { t, language } = useLanguage();
  const { config } = useAppConfig();
  const notices = language === 'bn' ? config.notices.bn : config.notices.en;

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

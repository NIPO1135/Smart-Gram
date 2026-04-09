
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppConfig } from '../context/AppConfigContext';
import { BellRing } from 'lucide-react';

const NOTICE_API_URL = 'http://localhost:5000/api/notices';

const NoticeBoard: React.FC = () => {
  const { t, language } = useLanguage();
  const { config } = useAppConfig();
  const [remoteNotices, setRemoteNotices] = useState<{ bn: string; en: string } | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(NOTICE_API_URL);
        const data = await response.json();
        const bn = typeof data?.notices?.bn === 'string' ? data.notices.bn : '';
        const en = typeof data?.notices?.en === 'string' ? data.notices.en : '';
        if (response.ok && bn && en) {
          setRemoteNotices({ bn, en });
        }
      } catch {
        // Ignore network error and use config fallback.
      }
    };

    fetchNotices();
  }, []);

  const source = remoteNotices ?? config.notices;
  const notices = language === 'bn' ? source.bn : source.en;

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

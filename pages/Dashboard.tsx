
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useAppConfig } from '../context/AppConfigContext';
import NoticeBoard from '../components/NoticeBoard';
import HelpdeskCard from '../components/HelpdeskCard';
import YouthSection from '../components/YouthSection';
import PopularProducts from '../components/PopularProducts';
import RuralAnimation from '../components/RuralAnimation';
import { 
  PhoneCall, 
  Sprout, 
  ShoppingBag, 
  Heart
} from 'lucide-react';

const Dashboard: React.FC<{ onViewChange?: (view: string) => void }> = ({ onViewChange }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { config } = useAppConfig();

  const ICONS = {
    PhoneCall,
    Sprout,
    ShoppingBag,
    Heart,
  } as const;

  const DEFAULT_TEXT_KEYS = {
    emergency: { titleKey: 'emergency', descKey: 'emergencyDesc' },
    agriculture: { titleKey: 'agriculture', descKey: 'agriDesc' },
    shopping: { titleKey: 'shopping', descKey: 'shopDesc' },
    blood: { titleKey: 'blood', descKey: 'bloodDesc' },
  } as const;

  const gridCategories = config.dashboardCards
    .filter((c) => c.enabled)
    .map((c) => {
      const keys = DEFAULT_TEXT_KEYS[c.id];
      const defaultTitle = (t as any)[keys.titleKey] as string;
      const defaultDesc = (t as any)[keys.descKey] as string;

      const titleOverride = language === 'bn' ? c.titleOverride?.bn : c.titleOverride?.en;
      const descOverride = language === 'bn' ? c.descOverride?.bn : c.descOverride?.en;

      const title = (titleOverride?.trim() ? titleOverride : defaultTitle) ?? defaultTitle;
      const desc = (descOverride?.trim() ? descOverride : defaultDesc) ?? defaultDesc;

      const icon = ICONS[c.iconKey];

      return {
        id: c.id,
        title,
        desc,
        icon,
        color: c.color,
        lightColor: c.lightColor,
        action: () => onViewChange?.(c.id),
      };
    });

  return (
    <div className="pb-28">
      {/* Hero Header Section - Full bg rural scene on mobile & desktop */}
      <div className="bg-green-600 pt-8 pb-16 px-6 rounded-b-[3.5rem] shadow-xl mb-4 relative overflow-hidden min-h-[180px]">
        {/* গ্রামীণ দৃশ্য - পুরো header background (mobile + desktop) */}
        <div className="absolute inset-0 z-0">
          <RuralAnimation />
        </div>
        {/* Green overlay for readability */}
        <div className="absolute inset-0 bg-green-600/70 z-[1]" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 z-[1]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="relative z-10">
              <h2 className="text-white text-2xl font-black flex items-center leading-none drop-shadow-sm">
                {t.welcome} <span className="ml-2 bg-white/20 px-4 py-1.5 rounded-2xl text-lg backdrop-blur-md border border-white/10">{user?.name}</span>
              </h2>
              <p className="text-green-100 mt-3 font-bold opacity-80 tracking-widest uppercase text-[10px] drop-shadow-sm">{t.tagline}</p>
            </div>
            <div className="hidden sm:block w-32 h-24 relative z-10" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        {/* Notice Ticker */}
        <div className="mb-6 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50 bg-white">
          <NoticeBoard />
        </div>

        {/* 2x3 Grid for Main Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {gridCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={cat.action}
              className={`p-6 rounded-[2.8rem] flex flex-col items-center justify-center text-center space-y-4 transition-all transform hover:shadow-xl hover:-translate-y-1 active:scale-95 shadow-sm border border-transparent hover:border-white ${cat.lightColor} group min-h-[160px]`}
            >
              <div className={`${cat.color} p-4 rounded-3xl text-white shadow-xl shadow-black/5 group-hover:rotate-12 transition-transform`}>
                <cat.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-gray-800 text-[13px] sm:text-base leading-none tracking-tight">{cat.title}</h3>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase leading-tight mt-1.5 opacity-60 tracking-wider">{cat.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* SmartGram Youth Section */}
        <YouthSection onNavigate={(path) => onViewChange?.(path)} />

        {/* Feature-Rich Helpdesk Card (Spans Full Width) */}
        <div className="mb-6">
          <HelpdeskCard />
        </div>

        {/* Popular Products Section */}
        <PopularProducts />
      </div>
    </div>
  );
};

export default Dashboard;

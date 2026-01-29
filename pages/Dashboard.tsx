
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import NoticeBoard from '../components/NoticeBoard';
import HelpdeskCard from '../components/HelpdeskCard';
import PopularProducts from '../components/PopularProducts';
import RuralAnimation from '../components/RuralAnimation';
import { 
  PhoneCall, 
  Sprout, 
  GraduationCap, 
  ShoppingBag, 
  Heart, 
  Trophy,
  Share2,
  Award
} from 'lucide-react';

const Dashboard: React.FC<{ onViewChange?: (view: string) => void }> = ({ onViewChange }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const gridCategories = [
    {
      id: 'emergency',
      title: t.emergency,
      desc: t.emergencyDesc,
      icon: PhoneCall,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      action: () => onViewChange?.('emergency')
    },
    {
      id: 'agriculture',
      title: t.agriculture,
      desc: t.agriDesc,
      icon: Sprout,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      action: () => onViewChange?.('agriculture')
    },
    {
      id: 'education',
      title: t.education,
      desc: t.eduDesc,
      icon: GraduationCap,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      action: () => onViewChange?.('education')
    },
    {
      id: 'shopping',
      title: t.shopping,
      desc: t.shopDesc,
      icon: ShoppingBag,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      action: () => onViewChange?.('shopping')
    },
    {
      id: 'blood',
      title: t.blood,
      desc: t.bloodDesc,
      icon: Heart,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50',
      action: () => onViewChange?.('blood')
    },
    {
      id: 'sports',
      title: t.sports,
      desc: t.sportsDesc,
      icon: Trophy,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      action: () => onViewChange?.('sports')
    },
    {
      id: 'sharingMarket',
      title: t.sharingMarket,
      desc: t.sharingMarketDesc,
      icon: Share2,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      action: () => onViewChange?.('sharingMarket')
    },
    {
      id: 'talentHub',
      title: t.talentHub,
      desc: t.talentHubDesc,
      icon: Award,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      action: () => onViewChange?.('talentHub')
    }
  ];

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

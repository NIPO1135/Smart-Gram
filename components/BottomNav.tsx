
import React from 'react';
import { Home, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab: 'home' | 'profile';
  setActiveTab: (tab: 'home' | 'profile') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'profile', label: t.navProfile, icon: User },
  ] as const;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white/70 backdrop-blur-xl border border-white/40 px-2 py-2 flex justify-around items-center z-[90] shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2rem]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex flex-col items-center py-1 transition-all group relative"
          >
            <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 scale-105' : 'text-gray-400 group-hover:text-green-600'}`}>
              <Icon className={`w-5 h-5`} />
            </div>
            <span className={`text-[8px] font-black tracking-widest uppercase mt-1 transition-all duration-300 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;

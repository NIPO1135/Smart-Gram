
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-green-600 p-1.5 rounded-lg shadow-sm">
            <Home className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-green-800 leading-none">{t.appName}</h1>
            <p className="text-[9px] text-green-600 uppercase tracking-widest font-bold">Powered by Ozysa Ltd.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

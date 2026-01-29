
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1 bg-green-100 p-1 rounded-full border border-green-200">
      <button
        onClick={() => setLanguage('bn')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          language === 'bn' ? 'bg-green-600 text-white shadow-sm' : 'text-green-700 hover:bg-green-200'
        }`}
      >
        বাংলা
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          language === 'en' ? 'bg-green-600 text-white shadow-sm' : 'text-green-700 hover:bg-green-200'
        }`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageToggle;

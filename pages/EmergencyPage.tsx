
import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppConfig, EmergencyCategoryConfig, EmergencyIconKey } from '../context/AppConfigContext';
import { 
  Phone, 
  Search, 
  Siren, 
  Stethoscope, 
  Flame, 
  Zap, 
  Dog, 
  ArrowLeft
} from 'lucide-react';

const EmergencyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const { config } = useAppConfig();

  const ICONS: Record<EmergencyIconKey, React.ElementType> = {
    Siren,
    Stethoscope,
    Flame,
    Zap,
    Dog,
  };

  const TITLE_KEYS: Record<EmergencyCategoryConfig['id'], keyof typeof t> = {
    ambulance: 'catAmbulance',
    doctor: 'catDoctor',
    fire: 'catFirePolice',
    electricity: 'catElectricity',
    animal: 'catAnimalDoctor',
  };

  const emergencyData = useMemo(() => {
    return config.emergencyCategories
      .filter(cat => cat.enabled)
      .map(cat => {
        const titleKey = TITLE_KEYS[cat.id];
        const defaultTitle = (t as any)[titleKey] as string;
        const overrideTitle = language === 'bn' ? cat.titleOverride?.bn : cat.titleOverride?.en;
        const title = overrideTitle && overrideTitle.trim() ? overrideTitle : defaultTitle;

        return {
          id: cat.id,
          title,
          icon: ICONS[cat.iconKey],
          color: cat.color,
          contacts: cat.contacts.map(contact => {
            const name = language === 'bn' ? contact.name.bn : contact.name.en;
            const description = language === 'bn' ? contact.description.bn : contact.description.en;
            return {
              name,
              description,
              phone: contact.phone,
            };
          }),
        };
      });
  }, [config.emergencyCategories, ICONS, TITLE_KEYS, language, t]);

  const filteredData = emergencyData.map(cat => ({
    ...cat,
    contacts: cat.contacts.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.contacts.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-40 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="bg-white px-4 pt-6 pb-4 sticky top-0 z-40 border-b border-gray-100 flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-black text-gray-900 leading-tight">{t.emergencyTitle}</h2>
      </div>

      <div className="p-4 space-y-8 max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="relative group mx-2 mt-4">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-300 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-4 py-5 bg-white border border-gray-100 rounded-[2.5rem] focus:ring-4 focus:ring-red-500/10 outline-none text-sm font-bold transition-all shadow-xl shadow-black/[0.02]"
            placeholder={t.emergencySearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories & Contact Cards */}
        <div className="space-y-12">
          {filteredData.map((category) => (
            <div key={category.id} className="animate-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center space-x-3 mb-6 px-3">
                <div className={`${category.color} p-2.5 rounded-2xl text-white shadow-lg shadow-black/5`}>
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-gray-800 tracking-tight">{category.title}</h3>
              </div>
              
              <div className="space-y-4">
                {category.contacts.map((contact, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all group"
                  >
                    <div className="pl-2">
                      <h4 className="font-black text-gray-800 text-base leading-none">{contact.name}</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] mt-2.5 opacity-60">{contact.description}</p>
                    </div>
                    <div className="flex items-center">
                      <a 
                        href={`tel:${contact.phone}`}
                        className="bg-red-50 text-red-600 px-7 py-3.5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-sm active:scale-90 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 min-w-[120px]"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{t.callNow}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="text-center py-24 opacity-20">
              <Search className="w-20 h-20 mx-auto mb-6" />
              <p className="font-black uppercase tracking-[0.3em] text-[10px]">No matches found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;

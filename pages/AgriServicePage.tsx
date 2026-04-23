
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppConfig } from '../context/AppConfigContext';
import KrishiShebaSection from '../components/KrishiShebaSection';
import DailyFarmingTipCard from '../components/DailyFarmingTipCard';
import PestIdentificationGallery from '../components/PestIdentificationGallery';
import AIPlantDiagnosisBanner from '../components/AIPlantDiagnosisBanner';
import { 
  ArrowLeft, 
  Search,
  Leaf,
  CalendarRange,
  BookOpenText
} from 'lucide-react';

const AgriServicePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const { config } = useAppConfig();
  
  const farmingTips = config.agriculture.tips.filter(c => c.enabled);
  
  const [tipSearch, setTipSearch] = useState('');

  const filteredFarmingTips = farmingTips.filter((tip) => {
    const normalizedQuery = tipSearch.trim().toLowerCase();
    if (!normalizedQuery) return true;
    const crop = language === 'bn' ? tip.cropName.bn : tip.cropName.en;
    return crop.toLowerCase().includes(normalizedQuery);
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-32 flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 sticky top-0 z-40 border-b border-green-100 flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-green-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-green-700" />
        </button>
        <h2 className="text-xl font-black text-green-900 leading-tight">{t.agriTitle}</h2>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto w-full flex-1">
        <KrishiShebaSection />
        <DailyFarmingTipCard />
        <PestIdentificationGallery />

        {/* Farming Tips List */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-emerald-50">
          <div className="flex items-center space-x-3 mb-5">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
              <BookOpenText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-800 leading-none">
                {t.farmingTipsList}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                {t.searchCropName}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={tipSearch}
                onChange={(e) => setTipSearch(e.target.value)}
                placeholder={t.tipSearchPlaceholder}
                className="w-full bg-transparent outline-none border-none text-sm font-semibold text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFarmingTips.length === 0 ? (
              <div className="text-center py-6 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-sm font-bold text-amber-700">
                  {t.noTipsFound}
                </p>
              </div>
            ) : (
              filteredFarmingTips.map((tip) => (
                <div key={tip.id} className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-base font-black text-emerald-900">{language === 'bn' ? tip.cropName.bn : tip.cropName.en}</h4>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 bg-white/70 px-2 py-1 rounded-xl border border-emerald-100">
                      <CalendarRange className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-black uppercase tracking-wider">{language === 'bn' ? tip.season.bn : tip.season.en}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed">{language === 'bn' ? tip.description.bn : tip.description.en}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* AI Plant Diagnosis - Prominent fully separate feature */}
        <AIPlantDiagnosisBanner />

      </div>
    </div>
  );
};

export default AgriServicePage;

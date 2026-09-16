import React, { useState } from 'react';
import { ShieldPlus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAppConfig, PestConfig } from '../context/AppConfigContext';

const PestIdentificationGallery: React.FC = () => {
  const [activeTreatment, setActiveTreatment] = useState<PestConfig | null>(null);
  const { t, language } = useLanguage();
  const { config } = useAppConfig();
  
  const pestItems = config.agriculture.pests.filter(p => p.enabled);

  return (
    <>
      <section className="rounded-[2rem] border border-emerald-100 bg-white p-5 sm:p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg sm:text-xl font-black text-emerald-900">{t.pestGalleryTitle}</h3>
          <p className="mt-1 text-sm font-semibold text-gray-600">
            {t.pestGallerySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pestItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
              <div className="relative group">
                <img
                  src={item.image}
                  alt={language === 'bn' ? item.diseaseName.bn : item.diseaseName.en}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setActiveTreatment(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-lg hover:bg-emerald-700"
                  >
                    <ShieldPlus className="w-3.5 h-3.5" />
                    {t.treatment}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm sm:text-base font-black text-gray-800">{language === 'bn' ? item.diseaseName.bn : item.diseaseName.en}</h4>
                <p className="mt-1.5 text-sm font-medium text-gray-600 leading-relaxed">{language === 'bn' ? item.caption.bn : item.caption.en}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {activeTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h4 className="text-lg sm:text-xl font-black text-emerald-900">{language === 'bn' ? activeTreatment.diseaseName.bn : activeTreatment.diseaseName.en}</h4>
              <button
                type="button"
                onClick={() => setActiveTreatment(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close treatment details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed">{language === 'bn' ? activeTreatment.treatment.bn : activeTreatment.treatment.en}</p>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTreatment(null)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700"
              >
                {t.closeDialog || t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PestIdentificationGallery;

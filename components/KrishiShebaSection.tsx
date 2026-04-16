import React from 'react';
import { Sprout, Bug, Tractor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type KrishiCard = {
  id: string;
  title: { en: string; bn: string };
  description: { en: string; bn: string };
  Icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
  softClass: string;
};

const krishiCards: KrishiCard[] = [
  {
    id: 'crop-guidance',
    title: { bn: 'ফসল নির্দেশনা', en: 'Crop Guidance' },
    description: {
      bn: 'মৌসুমভিত্তিক ফসল নির্বাচন, বপন সময় এবং সার ব্যবহারের সঠিক পরামর্শ পান।',
      en: 'Get expert advice on seasonal crop selection, sowing time, and fertilizer usage.',
    },
    Icon: Sprout,
    accentClass: 'text-emerald-600',
    softClass: 'bg-emerald-50 border-emerald-100',
  },
  {
    id: 'pest-control',
    title: { bn: 'পোকা দমন', en: 'Pest Control' },
    description: {
      bn: 'সাধারণ পোকা ও রোগ সনাক্ত করে নিরাপদ প্রতিকার এবং প্রতিরোধ পদ্ধতি জানুন।',
      en: 'Identify common pests and diseases and learn safe remedies and prevention methods.',
    },
    Icon: Bug,
    accentClass: 'text-rose-600',
    softClass: 'bg-rose-50 border-rose-100',
  },
  {
    id: 'modern-farming',
    title: { bn: 'আধুনিক চাষাবাদ', en: 'Modern Farming' },
    description: {
      bn: 'আধুনিক কৃষি প্রযুক্তি, স্মার্ট সেচ এবং উৎপাদন বাড়ানোর নতুন কৌশল শিখুন।',
      en: 'Learn modern agricultural technologies, smart irrigation, and new ways to boost yield.',
    },
    Icon: Tractor,
    accentClass: 'text-indigo-600',
    softClass: 'bg-indigo-50 border-indigo-100',
  },
];

const KrishiShebaSection: React.FC = () => {
  const { language } = useLanguage();

  return (
    <section className="w-full rounded-[2rem] bg-white border border-green-100 p-5 sm:p-6 shadow-sm">
      <div className="mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-green-900">{language === 'bn' ? 'কৃষি সেবা' : 'Agriculture Services'}</h2>
        <p className="mt-1 text-sm font-semibold text-gray-600">
          {language === 'bn' ? 'কৃষকদের জন্য প্রয়োজনীয় গাইডলাইন, সতর্কতা ও আধুনিক কৃষি তথ্য।' : 'Essential guidelines, alerts, and modern farming info for farmers.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {krishiCards.map((card) => (
          <article
            key={card.id}
            className={`rounded-2xl border p-4 sm:p-5 transition-all hover:shadow-md ${card.softClass}`}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white/80 p-2.5 border border-white">
                <card.Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.accentClass}`} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-800 leading-tight">{language === 'bn' ? card.title.bn : card.title.en}</h3>
                <p className="mt-2 text-sm font-medium text-gray-700 leading-relaxed">{language === 'bn' ? card.description.bn : card.description.en}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default KrishiShebaSection;

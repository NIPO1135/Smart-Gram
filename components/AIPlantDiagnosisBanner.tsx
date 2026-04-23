import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AIDiagnosisModal from './AIDiagnosisModal';

const AIPlantDiagnosisBanner: React.FC = () => {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section 
        className="relative overflow-hidden w-full rounded-[2rem] bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6 sm:p-8 shadow-lg group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-teal-400 opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 delay-100"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:justify-between gap-6">
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              {language === 'bn' ? 'নতুন এআই ফিচার' : 'New AI Feature'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
              {language === 'bn' ? 'এআই উদ্ভিদ রোগ নির্ণয়' : 'AI Plant Diagnosis'}
            </h2>
            <p className="text-emerald-50 text-sm sm:text-base font-medium max-w-xl opacity-90 leading-relaxed">
              {language === 'bn' 
                ? 'আপনার গাছের ক্ষতিকর রোগ বা পোকা শনাক্ত করতে শুধু একটি ছবি তুলুন। আমাদের কৃত্রিম বুদ্ধিমত্তা আপনাকে সাথে সাথে সমাধান ও প্রতিকার জানাবে সম্পূর্ণ বিনামূল্যে।' 
                : 'Take a photo of your plant to identify destructive diseases or pests. Our Artificial Intelligence will instantly provide you with organic remedies and solutions for free.'}
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <button 
              className="group/btn flex items-center justify-center gap-2 bg-white text-emerald-700 px-6 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all w-full sm:w-auto"
            >
              {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <AIDiagnosisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AIPlantDiagnosisBanner;


import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppConfig } from '../context/AppConfigContext';
import KrishiShebaSection from '../components/KrishiShebaSection';
import DailyFarmingTipCard from '../components/DailyFarmingTipCard';
import PestIdentificationGallery from '../components/PestIdentificationGallery';
import { 
  ArrowLeft, 
  Sprout, 
  Camera, 
  Loader2, 
  CheckCircle2,
  Trash2,
  Search,
  Leaf,
  CalendarRange,
  BookOpenText
} from 'lucide-react';

interface AnalysisResult {
  diseaseName: string;
  symptoms: string;
  solution: string;
}

const AI_DIAGNOSIS_API_URL = 'http://localhost:5000/api/ai/plant-diagnosis';

const AgriServicePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const { config } = useAppConfig();
  
  const farmingTips = config.agriculture.tips.filter(c => c.enabled);
  
  const [tipSearch, setTipSearch] = useState('');


  // Diagnosis State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAnalysisError(language === 'bn' ? 'শুধু ছবি ফাইল নির্বাচন করুন।' : 'Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setSelectedImage(dataUrl);
        analyzePlant(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePlant = async (base64Image: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);
    try {
      const [mimePrefix, dataPart] = base64Image.split(',');
      if (!mimePrefix || !dataPart) {
        throw new Error(language === 'bn' ? 'ছবির ডাটা সঠিক নয়।' : 'Invalid image data.');
      }

      const response = await fetch(AI_DIAGNOSIS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: base64Image,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          language === 'bn'
            ? 'রোগ বিশ্লেষণ সার্ভিসে সমস্যা হয়েছে।'
            : 'Plant diagnosis service failed.',
        );
      }

      if (!data?.result) {
        throw new Error(language === 'bn' ? 'AI response ফরম্যাট ভুল।' : 'Invalid AI response format.');
      }

      setAnalysisResult(data.result as AnalysisResult);
    } catch (error) {
      console.error(error);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : language === 'bn'
            ? 'রোগ বিশ্লেষণ করা যায়নি। আবার চেষ্টা করুন।'
            : 'Could not analyze disease. Please try again.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

        {/* AI Plant Diagnosis */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-green-50">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-2xl text-green-600">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-800 leading-none">{t.plantDiagnosis}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Identify Crop Disease</p>
            </div>
          </div>

          {!selectedImage ? (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-green-200 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-green-50/30 hover:bg-green-50 transition-all group"
            >
              <div className="bg-green-600 p-5 rounded-3xl text-white shadow-lg shadow-green-600/20 mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <span className="text-sm font-black text-green-800 uppercase tracking-widest">{t.identifyCropDisease}</span>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </button>
          ) : (
            <div className="space-y-6">
              <div className="relative group rounded-[2rem] overflow-hidden shadow-lg border border-green-100">
                <img src={selectedImage} alt="Leaf" className="w-full h-64 object-cover" />
                <button 
                  onClick={clearAnalysis}
                  className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl shadow-lg active:scale-90 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isAnalyzing && (
                <div className="flex flex-col items-center py-6">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-2" />
                  <p className="text-xs font-black text-green-800 uppercase tracking-widest">{t.analyzing}</p>
                </div>
              )}

              {analysisError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-bold text-red-700">{analysisError}</p>
                </div>
              )}

              {analysisResult && (
                <div className="bg-white border border-green-100 rounded-[2rem] p-6 space-y-5 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">{t.analysisResult || "Analysis Complete"}</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{t.diseaseName}</h4>
                    <p className="text-xl font-black text-gray-800 leading-tight">{analysisResult.diseaseName}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.symptoms}</p>
                      <p className="text-sm font-bold text-gray-700 leading-relaxed">{analysisResult.symptoms}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                      <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">{t.solution}</p>
                      <p className="text-sm font-black text-gray-800 leading-relaxed">{analysisResult.solution}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AgriServicePage;

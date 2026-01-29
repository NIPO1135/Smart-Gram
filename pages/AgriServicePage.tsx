
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  ArrowLeft, 
  Sprout, 
  Camera, 
  CloudRain, 
  Thermometer, 
  Loader2, 
  Send,
  Mic,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface AnalysisResult {
  diseaseName: string;
  symptoms: string;
  solution: string;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AgriServicePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();
  
  // Weather State
  const [weatherAdvice, setWeatherAdvice] = useState<string>("");
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  // Diagnosis State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWeatherAdvice();
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchWeatherAdvice = async () => {
    setIsWeatherLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a senior agricultural officer in Bangladesh. It's a typical day (temp 31°C, partially cloudy). Give a 1-sentence helpful weather-related advice for a farmer in ${language === 'bn' ? 'Bengali' : 'English'}. For example: "আজ বৃষ্টির সম্ভাবনা আছে, ফসল দ্রুত ঘরে তুলুন" if relevant.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setWeatherAdvice(response.text || "");
    } catch (error) {
      console.error(error);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        analyzePlant(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePlant = async (base64Image: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this plant leaf image. Identify any disease. Respond in ${language === 'bn' ? 'Bengali' : 'English'}. Return only a JSON object with keys: diseaseName, symptoms, and solution.`;
      const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } };
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [imagePart, { text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diseaseName: { type: Type.STRING },
              symptoms: { type: Type.STRING },
              solution: { type: Type.STRING },
            },
            required: ["diseaseName", "symptoms", "solution"],
          },
        },
      });
      setAnalysisResult(JSON.parse(response.text || '{}') as AnalysisResult);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userText = inputText;
    setInputText("");
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userText,
        config: {
          systemInstruction: `You are a professional agricultural expert advisor for rural farmers in Bangladesh. 
          Provide helpful, accurate, and concise advice on farming, crops, and pest control. 
          Respond in ${language === 'bn' ? 'Bengali' : 'English'}. 
          Always be encouraging and practical.`,
        },
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "" }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const clearAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

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
        
        {/* 1. Top: AI Weather Advisor */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-10">
            <CloudRain className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-80">{t.weatherAdvisor}</h3>
              <Thermometer className="w-5 h-5 text-green-300" />
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-5xl font-black">31°C</span>
              <div className="h-10 w-[1px] bg-white/20"></div>
              <p className="text-sm font-bold opacity-90">{language === 'bn' ? 'আংশিক মেঘলা' : 'Partly Cloudy'}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-green-200 mb-1">{t.weatherAdviceLabel}</p>
              {isWeatherLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <p className="text-sm font-bold leading-relaxed">"{weatherAdvice}"</p>
              )}
            </div>
          </div>
        </section>

        {/* 2. Middle: AI Plant Diagnosis */}
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

        {/* 3. Bottom: Expert Connect (Messenger Style) */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-xl text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-gray-800">{t.expertConnect}</h3>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Live Advisor</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-10">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">{t.typeProblemPlaceholder}</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-gray-400 px-5 py-3 rounded-2xl flex items-center space-x-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.thinking}</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center space-x-2 bg-white rounded-2xl p-2 border border-gray-200 focus-within:ring-2 focus-within:ring-green-500 transition-all shadow-sm">
              <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t.typeProblemPlaceholder}
                className="flex-1 bg-transparent border-none focus:ring-0 outline-none px-2 text-sm font-medium"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isThinking}
                className="bg-green-600 text-white p-3 rounded-xl shadow-lg shadow-green-600/20 active:scale-90 transition-all disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AgriServicePage;

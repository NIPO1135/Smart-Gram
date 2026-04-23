import React, { useState, useRef } from 'react';
import { X, Upload, Activity, AlertCircle, CheckCircle2, Leaf, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCbj3wnLYX3OqfDQiBnV5itUdZjDpDlFv0';

interface AIDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(language === 'bn' ? 'দয়া করে একটি ছবি আপলোড করুন' : 'Please upload an image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prompt = language === 'bn' 
        ? "আপনি একজন বিশেষজ্ঞ কৃষিবিদ এবং উদ্ভিদ রোগ বিশ্লেষক। এই গাছের ছবি বিশ্লেষণ করুন। যদি কোন রোগ বা পোকা থাকে, তা সনাক্ত করুন। দয়া করে বাংলায় বিস্তারিত উত্তর দিন: ১. রোগের নাম বা পোকার নাম, ২. লক্ষণসমূহ, ৩. প্রতিকার ব্যবস্থা এবং জৈব সমাধান।"
        : "You are an expert agronomist and plant pathologist. Analyze this image of a plant. If there is a disease or pest, identify it. Please provide a detailed response in English including: 1. Name of the disease/pest, 2. Symptoms observed, and 3. Treatment and organic remedies.";

      const base64Data = await fileToBase64(selectedFile);
      const mimeType = selectedFile.type;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inline_data: { mime_type: mimeType, data: base64Data } },
                { text: prompt }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API Request Failed');
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No valid response received from Gemini');
      }

      setResult(text);
    } catch (err: any) {
      console.error(err);
      setError(language === 'bn' ? `দুঃখিত, চিত্র বিশ্লেষণ করতে ব্যর্থ হয়েছে: ${err.message}` : `Failed to analyze the image: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm sm:p-6 transition-opacity">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="flex items-center gap-3 w-full">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Leaf className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {language === 'bn' ? 'এআই উদ্ভিদ রোগ নির্ণয়' : 'AI Plant Disease Diagnosis'}
              </h2>
              <p className="text-sm font-medium text-emerald-700">
                 {language === 'bn' ? 'গাছের ছবি আপলোড করে রোগ শনাক্ত করুন' : 'Upload a plant image to detect diseases'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); onClose(); }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors self-start"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!selectedFile ? (
            <div 
              className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                <Upload className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {language === 'bn' ? 'এখানে ছবি নির্বাচন করুন' : 'Select an image here'}
              </h3>
              <p className="text-gray-500 max-w-sm mb-6">
                {language === 'bn' ? 'আপনার ক্ষতিগ্রস্ত গাছের একটি পরিষ্কার ছবি আপলোড করুন' : 'Upload a clear picture of your affected plant'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                 {language === 'bn' ? 'ছবি খুঁজুন' : 'Browse File'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 aspect-video flex items-center justify-center">
                {previewUrl && (
                  <img src={previewUrl} alt="Plant preview" className="max-h-full max-w-full object-contain" />
                )}
                {!loading && !result && (
                   <button
                   onClick={resetForm}
                   className="absolute top-3 right-3 bg-white/80 backdrop-blur text-gray-700 p-2 rounded-full hover:bg-white shadow-sm transition-all"
                 >
                   <X className="w-4 h-4" />
                 </button>
                )}
              </div>

              {!result && !loading && (
                <div className="flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-3.5 rounded-full font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Activity className="w-5 h-5" />
                    {language === 'bn' ? 'রোগ বিশ্লেষণ করুন' : 'Diagnose Disease'}
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                  <p className="text-emerald-700 font-semibold animate-pulse">
                    {language === 'bn' ? 'কৃত্রিম বুদ্ধিমত্তা ছবি বিশ্লেষণ করছে...' : 'AI is analyzing the image...'}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {result && (
                <div className="bg-emerald-50 rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 border-b border-emerald-200 pb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <h3 className="text-xl font-bold text-emerald-900">
                      {language === 'bn' ? 'বিশ্লেষণ ফলাফল' : 'Diagnosis Result'}
                    </h3>
                  </div>
                  <div className="prose prose-emerald max-w-none text-gray-700 font-medium whitespace-pre-wrap">
                    {result}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={resetForm}
                      className="text-emerald-700 hover:text-emerald-800 font-bold px-6 py-2 bg-emerald-100 hover:bg-emerald-200 rounded-full transition-colors"
                    >
                      {language === 'bn' ? 'নতুন ছবি বিশ্লেষণ করুন' : 'Analyze New Image'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosisModal;

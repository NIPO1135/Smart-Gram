import React, { useState } from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, Plus, Trash2, Sprout, Bug, BookOpen, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { LocalizedText, FarmingTipConfig, PestConfig } from '../../context/AppConfigContext';

export default function AdminAgriculture({ draft, setDraft, labels, language, onSave, onBack }: AdminSubViewProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'tips' | 'pests'>('daily');

  const updateDailyTipEn = (val: string) => {
    setDraft(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        dailyTip: { ...prev.agriculture.dailyTip, en: val }
      }
    }));
  };

  const updateDailyTipBn = (val: string) => {
    setDraft(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        dailyTip: { ...prev.agriculture.dailyTip, bn: val }
      }
    }));
  };

  const updateInstructionEn = (idx: number, val: string) => {
    setDraft(prev => {
      const newList = [...prev.agriculture.dailyInstructions];
      newList[idx] = { ...newList[idx], en: val };
      return { ...prev, agriculture: { ...prev.agriculture, dailyInstructions: newList } };
    });
  };

  const updateInstructionBn = (idx: number, val: string) => {
    setDraft(prev => {
      const newList = [...prev.agriculture.dailyInstructions];
      newList[idx] = { ...newList[idx], bn: val };
      return { ...prev, agriculture: { ...prev.agriculture, dailyInstructions: newList } };
    });
  };

  const addInstruction = () => {
    setDraft(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        dailyInstructions: [...prev.agriculture.dailyInstructions, { en: '', bn: '' }]
      }
    }));
  };

  const removeInstruction = (idx: number) => {
    setDraft(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        dailyInstructions: prev.agriculture.dailyInstructions.filter((_, i) => i !== idx)
      }
    }));
  };

  const addTip = () => {
    setDraft(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        tips: [
          ...prev.agriculture.tips,
          { id: `tip-${Date.now()}`, enabled: true, cropName: { en: '', bn: '' }, season: { en: '', bn: '' }, description: { en: '', bn: '' } }
        ]
      }
    }));
  };

  const updateTip = (idx: number, patch: Partial<FarmingTipConfig>) => {
    setDraft(prev => {
      const newList = [...prev.agriculture.tips];
      newList[idx] = { ...newList[idx], ...patch };
      return { ...prev, agriculture: { ...prev.agriculture, tips: newList } };
    });
  };

  const removeTip = (idx: number) => {
    setDraft(prev => ({
      ...prev,
      agriculture: { ...prev.agriculture, tips: prev.agriculture.tips.filter((_, i) => i !== idx) }
    }));
  };

  const addPest = () => {
    setDraft(prev => ({
      ...prev,
      agriculture: {
        ...prev.agriculture,
        pests: [
          ...prev.agriculture.pests,
          { id: `pest-${Date.now()}`, enabled: true, image: '', diseaseName: { en: '', bn: '' }, caption: { en: '', bn: '' }, treatment: { en: '', bn: '' } }
        ]
      }
    }));
  };

  const updatePest = (idx: number, patch: Partial<PestConfig>) => {
    setDraft(prev => {
      const newList = [...prev.agriculture.pests];
      newList[idx] = { ...newList[idx], ...patch };
      return { ...prev, agriculture: { ...prev.agriculture, pests: newList } };
    });
  };

  const removePest = (idx: number) => {
    setDraft(prev => ({
      ...prev,
      agriculture: { ...prev.agriculture, pests: prev.agriculture.pests.filter((_, i) => i !== idx) }
    }));
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{language === 'bn' ? 'কৃষি সেবা কনফিগারেশন' : 'Agriculture Setup'}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'টিপস, পোকা মাকড় ও পরামর্শ' : 'Manage tips & pests'}
          </p>
        </div>
      </div>

      <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
            activeTab === 'daily' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sprout className="w-4 h-4" />
          {language === 'bn' ? 'ডেইলি টিপস' : 'Daily Tip'}
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
            activeTab === 'tips' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          {language === 'bn' ? 'কৃষি পরামর্শ' : 'Farming Tips'}
        </button>
        <button
          onClick={() => setActiveTab('pests')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
            activeTab === 'pests' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bug className="w-4 h-4" />
          {language === 'bn' ? 'পোকামাকড়' : 'Pests Gallery'}
        </button>
      </div>

      {activeTab === 'daily' && (
        <div className="space-y-6">
          <div className="border border-emerald-100 rounded-[2rem] p-5 bg-emerald-50/30">
            <h4 className="font-black tracking-tight text-emerald-900 mb-4">{language === 'bn' ? 'আজকের কৃষি পরামর্শ' : 'Daily Tip Text'}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Bangla (বাংলা)</label>
                <textarea
                  rows={3}
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-semibold transition-all resize-none shadow-sm"
                  value={draft.agriculture.dailyTip.bn}
                  onChange={(e) => updateDailyTipBn(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">English</label>
                <textarea
                  rows={3}
                  className="w-full p-4 rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm font-semibold transition-all resize-none shadow-sm"
                  value={draft.agriculture.dailyTip.en}
                  onChange={(e) => updateDailyTipEn(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-[2rem] p-5">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-black tracking-tight text-gray-800">{language === 'bn' ? 'নির্দেশনা (Read More)' : 'Detailed Instructions'}</h4>
              <button onClick={addInstruction} className="bg-emerald-100 text-emerald-700 p-2 rounded-xl hover:bg-emerald-200 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {draft.agriculture.dailyInstructions.map((inst, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex-1 space-y-3">
                    <input 
                      placeholder="বাংলা..."
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none text-sm font-semibold"
                      value={inst.bn}
                      onChange={(e) => updateInstructionBn(idx, e.target.value)}
                    />
                    <input 
                      placeholder="English..."
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none text-sm font-semibold"
                      value={inst.en}
                      onChange={(e) => updateInstructionEn(idx, e.target.value)}
                    />
                  </div>
                  <button onClick={() => removeInstruction(idx)} className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
            <button onClick={addTip} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              <Plus className="w-4 h-4" />
              {language === 'bn' ? 'পরামর্শ যোগ করুন' : 'Add Tip'}
            </button>
          </div>
          {draft.agriculture.tips.map((tip, idx) => (
            <div key={tip.id} className="border border-gray-100 rounded-[2rem] p-5 bg-gray-50/40">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={tip.enabled} onChange={(e) => updateTip(idx, { enabled: e.target.checked })} className="accent-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
                </label>
                <button onClick={() => removeTip(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Crop (বাংলা)</label>
                  <input value={tip.cropName.bn} onChange={(e) => updateTip(idx, { cropName: { ...tip.cropName, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Crop (English)</label>
                  <input value={tip.cropName.en} onChange={(e) => updateTip(idx, { cropName: { ...tip.cropName, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Season (বাংলা)</label>
                  <input value={tip.season.bn} onChange={(e) => updateTip(idx, { season: { ...tip.season, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Season (English)</label>
                  <input value={tip.season.en} onChange={(e) => updateTip(idx, { season: { ...tip.season, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Description (বাংলা)</label>
                  <textarea rows={2} value={tip.description.bn} onChange={(e) => updateTip(idx, { description: { ...tip.description, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Description (English)</label>
                  <textarea rows={2} value={tip.description.en} onChange={(e) => updateTip(idx, { description: { ...tip.description, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pests' && (
        <div className="space-y-4">
          <div className="flex justify-end mb-2">
            <button onClick={addPest} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-emerald-700">
              <Plus className="w-4 h-4" />
              {language === 'bn' ? 'পোকা যোগ করুন' : 'Add Pest Info'}
            </button>
          </div>
          {draft.agriculture.pests.map((pest, idx) => (
            <div key={pest.id} className="border border-gray-100 rounded-[2rem] p-5 bg-gray-50/40">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={pest.enabled} onChange={(e) => updatePest(idx, { enabled: e.target.checked })} className="accent-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
                </label>
                <button onClick={() => removePest(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-3">
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Image URL</label>
                <input value={pest.image} onChange={(e) => updatePest(idx, { image: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-mono text-xs" placeholder="https://..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Disease Name (বাংলা)</label>
                  <input value={pest.diseaseName.bn} onChange={(e) => updatePest(idx, { diseaseName: { ...pest.diseaseName, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Disease Name (English)</label>
                  <input value={pest.diseaseName.en} onChange={(e) => updatePest(idx, { diseaseName: { ...pest.diseaseName, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Caption (বাংলা)</label>
                  <textarea rows={2} value={pest.caption.bn} onChange={(e) => updatePest(idx, { caption: { ...pest.caption, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Caption (English)</label>
                  <textarea rows={2} value={pest.caption.en} onChange={(e) => updatePest(idx, { caption: { ...pest.caption, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Treatment (বাংলা)</label>
                  <textarea rows={2} value={pest.treatment.bn} onChange={(e) => updatePest(idx, { treatment: { ...pest.treatment, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Treatment (English)</label>
                  <textarea rows={2} value={pest.treatment.en} onChange={(e) => updatePest(idx, { treatment: { ...pest.treatment, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onSave} className="mt-6 w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-xl shadow-green-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
}

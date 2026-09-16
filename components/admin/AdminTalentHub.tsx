import React from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, Plus, Trash2, CheckCircle2, XCircle, Award } from 'lucide-react';
import { TalentConfig } from '../../context/AppConfigContext';

export default function AdminTalentHub({ draft, setDraft, labels, language, onSave, onBack }: AdminSubViewProps) {

  const addTalent = () => {
    setDraft(prev => ({
      ...prev,
      talentHub: {
        ...prev.talentHub,
        talents: [
          ...(prev.talentHub?.talents || []),
          { 
            id: `talent-${Date.now()}`, 
            name: '', 
            skill: { en: '', bn: '' }, 
            description: { en: '', bn: '' }, 
            category: 'music', 
            location: '', 
            rating: 0, 
            approved: true 
          }
        ]
      }
    }));
  };

  const updateTalent = (idx: number, patch: Partial<TalentConfig>) => {
    setDraft(prev => {
      const newList = [...(prev.talentHub?.talents || [])];
      newList[idx] = { ...newList[idx], ...patch };
      return { ...prev, talentHub: { ...prev.talentHub, talents: newList } };
    });
  };

  const removeTalent = (idx: number) => {
    setDraft(prev => ({
      ...prev,
      talentHub: { ...prev.talentHub, talents: (prev.talentHub?.talents || []).filter((_, i) => i !== idx) }
    }));
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-purple-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-purple-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-purple-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{language === 'bn' ? 'ট্যালেন্ট হাব ম্যানেজমেন্ট' : 'Talent Hub Management'}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'প্রতিভা অনুমোদন ও সম্পাদনা' : 'Approve and edit talents'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end mb-2">
          <button onClick={addTalent} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
            <Plus className="w-4 h-4" />
            {language === 'bn' ? 'নতুন যোগ করুন' : 'Add Talent'}
          </button>
        </div>
        
        {(draft.talentHub?.talents || []).map((talent, idx) => (
          <div key={talent.id} className={`border rounded-[2rem] p-5 transition-colors ${talent.approved ? 'border-gray-100 bg-gray-50/40' : 'border-yellow-200 bg-yellow-50/40'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${talent.approved ? 'bg-purple-500' : 'bg-yellow-500'}`}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-gray-800 tracking-tight">{talent.name || 'Unnamed'}</h4>
                  <p className={`text-[10px] font-bold mt-0.5 ${talent.approved ? 'text-gray-400' : 'text-yellow-600'}`}>
                    {talent.approved 
                      ? (language === 'bn' ? 'অনুমোদিত' : 'Approved') 
                      : (language === 'bn' ? 'অপেক্ষমাণ (Pending)' : 'Pending Approval')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateTalent(idx, { approved: !talent.approved })} 
                  className={`p-2 rounded-xl transition-colors ${talent.approved ? 'text-gray-400 hover:bg-gray-100' : 'text-green-600 bg-green-100 hover:bg-green-200'}`}
                  title={talent.approved ? 'Unapprove' : 'Approve'}
                >
                  {talent.approved ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button onClick={() => removeTalent(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Name</label>
                <input value={talent.name} onChange={(e) => updateTalent(idx, { name: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Location</label>
                <input value={talent.location} onChange={(e) => updateTalent(idx, { location: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Skill (বাংলা)</label>
                <input value={talent.skill.bn} onChange={(e) => updateTalent(idx, { skill: { ...talent.skill, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Skill (English)</label>
                <input value={talent.skill.en} onChange={(e) => updateTalent(idx, { skill: { ...talent.skill, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Description (বাংলা)</label>
                <textarea rows={2} value={talent.description.bn} onChange={(e) => updateTalent(idx, { description: { ...talent.description, bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Description (English)</label>
                <textarea rows={2} value={talent.description.en} onChange={(e) => updateTalent(idx, { description: { ...talent.description, en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-semibold text-sm" />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Category</label>
                <select value={talent.category} onChange={(e) => updateTalent(idx, { category: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm">
                  <option value="music">Music / সঙ্গীত</option>
                  <option value="art">Art / শিল্প</option>
                  <option value="tech">Tech / প্রযুক্তি</option>
                  <option value="photography">Photography / ফটোগ্রাফি</option>
                  <option value="cooking">Cooking / রান্না</option>
                  <option value="craft">Craft / কারুশিল্প</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase mb-1">Rating</label>
                <input type="number" step="0.1" value={talent.rating} onChange={(e) => updateTalent(idx, { rating: parseFloat(e.target.value) || 0 })} className="w-full p-3 rounded-xl border border-gray-200 bg-white font-bold text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSave} className="mt-6 w-full bg-purple-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-700 active:scale-95 transition-all shadow-xl shadow-purple-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
}

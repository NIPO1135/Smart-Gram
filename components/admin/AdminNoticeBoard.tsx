import React from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft } from 'lucide-react';

const AdminNoticeBoard: React.FC<AdminSubViewProps> = ({ draft, setDraft, language, labels, onSave, onBack }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{labels.noticeTitle}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'নোটিশগুলো | (পাইভ) দিয়ে আলাদা করুন' : 'Separate notices by | (pipe)'}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.bangla}</label>
          <textarea
            value={draft.notices.bn}
            onChange={(e) => setDraft(prev => ({ ...prev, notices: { ...prev.notices, bn: e.target.value } }))}
            rows={6}
            className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.english}</label>
          <textarea
            value={draft.notices.en}
            onChange={(e) => setDraft(prev => ({ ...prev, notices: { ...prev.notices, en: e.target.value } }))}
            rows={6}
            className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
          />
        </div>
      </div>

      <button onClick={onSave} className="mt-8 w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-xl shadow-green-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
};

export default AdminNoticeBoard;

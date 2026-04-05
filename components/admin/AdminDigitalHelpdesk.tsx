import React from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft } from 'lucide-react';

const AdminDigitalHelpdesk: React.FC<AdminSubViewProps> = ({ draft, setDraft, language, labels, onSave, onBack }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{labels.helpdeskTitle || 'Digital Helpdesk'}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'হেল্পডেস্ক সার্ভিস অন/অফ এবং নাম পরিবর্তন' : 'Toggle and rename helpdesk services'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {draft.helpdesk.services.map((service, idx) => (
          <div key={service.id} className="border border-gray-100 rounded-[2rem] p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-gray-800 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">{service.id}</span>
              <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                <input
                  type="checkbox"
                  checked={service.enabled}
                  onChange={(e) =>
                    setDraft(prev => {
                      const next = [...prev.helpdesk.services];
                      next[idx] = { ...next[idx], enabled: e.target.checked };
                      return { ...prev, helpdesk: { ...prev.helpdesk, services: next } };
                    })
                  }
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled || 'Enabled'}</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                  {labels.overrideTitle || 'Override Title'} ({labels.bangla || 'BN'})
                </label>
                <input
                  value={service.titleOverride?.bn ?? ''}
                  onChange={(e) =>
                    setDraft(prev => {
                      const next = [...prev.helpdesk.services];
                      next[idx] = {
                        ...next[idx],
                        titleOverride: { en: next[idx].titleOverride?.en ?? '', bn: e.target.value }
                      };
                      return { ...prev, helpdesk: { ...prev.helpdesk, services: next } };
                    })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                  {labels.overrideTitle || 'Override Title'} ({labels.english || 'EN'})
                </label>
                <input
                  value={service.titleOverride?.en ?? ''}
                  onChange={(e) =>
                    setDraft(prev => {
                      const next = [...prev.helpdesk.services];
                      next[idx] = {
                        ...next[idx],
                        titleOverride: { bn: next[idx].titleOverride?.bn ?? '', en: e.target.value }
                      };
                      return { ...prev, helpdesk: { ...prev.helpdesk, services: next } };
                    })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSave} className="mt-6 w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-xl shadow-green-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
};

export default AdminDigitalHelpdesk;

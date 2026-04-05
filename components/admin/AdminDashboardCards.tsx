import React from 'react';
import { AdminSubViewProps } from './types';
import { Save, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { DashboardCardConfig, DashboardIconKey } from '../../context/AppConfigContext';

const ICON_OPTIONS: { key: DashboardIconKey; label: string }[] = [
  { key: 'PhoneCall', label: 'PhoneCall' },
  { key: 'Sprout', label: 'Sprout' },
  { key: 'ShoppingBag', label: 'ShoppingBag' },
  { key: 'Heart', label: 'Heart' },
];

function getDefaultTitleKey(id: DashboardCardConfig['id']) {
  switch (id) {
    case 'emergency': return 'emergency';
    case 'agriculture': return 'agriculture';
    case 'shopping': return 'shopping';
    case 'blood': return 'blood';
  }
}

function getDefaultDescKey(id: DashboardCardConfig['id']) {
  switch (id) {
    case 'emergency': return 'emergencyDesc';
    case 'agriculture': return 'agriDesc';
    case 'shopping': return 'shopDesc';
    case 'blood': return 'bloodDesc';
  }
}

const AdminDashboardCards: React.FC<AdminSubViewProps> = ({ draft, setDraft, language, t, labels, onSave, onBack }) => {
  const updateCard = (idx: number, patch: Partial<DashboardCardConfig>) => {
    setDraft(prev => {
      const nextCards = prev.dashboardCards.map((c, i) => (i === idx ? { ...c, ...patch } : c));
      return { ...prev, dashboardCards: nextCards };
    });
  };

  const moveCard = (idx: number, dir: -1 | 1) => {
    setDraft(prev => {
      const next = [...prev.dashboardCards];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[idx];
      next[idx] = next[target];
      next[target] = temp;
      return { ...prev, dashboardCards: next };
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-green-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-green-700" />
        </button>
        <div>
          <h3 className="font-black text-gray-800 text-xl">{labels.dashboardTitle}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'কার্ড অন/অফ, অর্ডার, নাম, আইকন পরিবর্তন' : 'Toggle, reorder, rename, change icon'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {draft.dashboardCards.map((card, idx) => {
          const defaultTitleKey = getDefaultTitleKey(card.id);
          const defaultDescKey = getDefaultDescKey(card.id);

          const defaultTitle = defaultTitleKey ? (t as any)[defaultTitleKey] : card.id;
          const defaultDesc = defaultDescKey ? (t as any)[defaultDescKey] : '';

          return (
            <div key={card.id} className="border border-gray-100 rounded-[2rem] p-5 bg-gray-50/40 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center text-white font-black text-xs`}>
                    {card.iconKey.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 tracking-tight">{defaultTitle}</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{labels.defaultLabel}: {defaultDesc}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => moveCard(idx, -1)} disabled={idx === 0} className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveCard(idx, 1)} disabled={idx === draft.dashboardCards.length - 1} className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                    <input type="checkbox" checked={card.enabled} onChange={(e) => updateCard(idx, { enabled: e.target.checked })} className="accent-green-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.overrideTitle} ({labels.bangla})</label>
                  <input value={card.titleOverride?.bn ?? ''} onChange={(e) => updateCard(idx, { titleOverride: { en: card.titleOverride?.en ?? '', bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.overrideTitle} ({labels.english})</label>
                  <input value={card.titleOverride?.en ?? ''} onChange={(e) => updateCard(idx, { titleOverride: { bn: card.titleOverride?.bn ?? '', en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.overrideDesc} ({labels.bangla})</label>
                  <input value={card.descOverride?.bn ?? ''} onChange={(e) => updateCard(idx, { descOverride: { en: card.descOverride?.en ?? '', bn: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.overrideDesc} ({labels.english})</label>
                  <input value={card.descOverride?.en ?? ''} onChange={(e) => updateCard(idx, { descOverride: { bn: card.descOverride?.bn ?? '', en: e.target.value } })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.icon}</label>
                  <select value={card.iconKey} onChange={(e) => updateCard(idx, { iconKey: e.target.value as DashboardIconKey })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold">
                    {ICON_OPTIONS.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{labels.color}</label>
                  <input value={card.color} onChange={(e) => updateCard(idx, { color: e.target.value })} className="w-full p-3 rounded-xl border border-gray-200 bg-white outline-none text-sm font-bold font-mono" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onSave} className="mt-6 w-full bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all shadow-xl shadow-green-600/30">
        <Save className="w-5 h-5" />
        {labels.save}
      </button>
    </div>
  );
};

export default AdminDashboardCards;

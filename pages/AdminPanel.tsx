import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronUp, RotateCcw, Save } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  AppConfig,
  DashboardCardConfig,
  DashboardIconKey,
  DEFAULT_APP_CONFIG,
  EmergencyCategoryConfig,
  HandmadeProductConfig,
  PopularProductConfig,
  PopularProductIconKey,
  BloodDonorConfig,
  BloodRequestConfig,
  useAppConfig,
} from '../context/AppConfigContext';

const ICON_OPTIONS: { key: DashboardIconKey; label: string }[] = [
  { key: 'PhoneCall', label: 'PhoneCall' },
  { key: 'Sprout', label: 'Sprout' },
  { key: 'ShoppingBag', label: 'ShoppingBag' },
  { key: 'Heart', label: 'Heart' },
];

const POPULAR_ICON_OPTIONS: { key: PopularProductIconKey; label: string }[] = [
  { key: 'Milk', label: 'Milk' },
  { key: 'Egg', label: 'Egg' },
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

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language, t } = useLanguage();
  const { config, setConfig, resetToDefaults } = useAppConfig();

  const [draft, setDraft] = useState<AppConfig>(() => config);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const labels = useMemo(() => {
    return {
      title: language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel',
      noticeTitle: language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board',
      dashboardTitle: language === 'bn' ? 'ড্যাশবোর্ড কার্ড' : 'Dashboard Cards',
      emergencyTitle: language === 'bn' ? 'ইমার্জেন্সি কন্টাক্ট' : 'Emergency Contacts',
      handmadeTitle: language === 'bn' ? 'হ্যান্ডমেড পণ্য' : 'Handmade Products',
      popularTitle: language === 'bn' ? 'পপুলার প্রোডাক্ট' : 'Popular Products',
      bloodTitle: language === 'bn' ? 'ব্লাড ব্যাংক ডাটা' : 'Blood Bank Data',
      english: language === 'bn' ? 'ইংরেজি' : 'English',
      bangla: language === 'bn' ? 'বাংলা' : 'Bangla',
      save: language === 'bn' ? 'সংরক্ষণ করুন' : 'Save',
      reset: language === 'bn' ? 'ডিফল্টে ফেরত' : 'Reset to defaults',
      enabled: language === 'bn' ? 'চালু' : 'Enabled',
      icon: language === 'bn' ? 'আইকন' : 'Icon',
      color: language === 'bn' ? 'কালার' : 'Color',
      lightColor: language === 'bn' ? 'লাইট কালার' : 'Light color',
      overrideTitle: language === 'bn' ? 'শিরোনাম (Override)' : 'Title override',
      overrideDesc: language === 'bn' ? 'বর্ণনা (Override)' : 'Description override',
      defaultLabel: language === 'bn' ? 'ডিফল্ট' : 'Default',
      success: language === 'bn' ? 'সেভ হয়েছে' : 'Saved',
      name: language === 'bn' ? 'নাম' : 'Name',
      description: language === 'bn' ? 'বর্ণনা' : 'Description',
      phone: language === 'bn' ? 'ফোন' : 'Phone',
      unit: language === 'bn' ? 'ইউনিট' : 'Unit',
      price: language === 'bn' ? 'দাম' : 'Price',
      group: language === 'bn' ? 'গ্রুপ' : 'Group',
      location: language === 'bn' ? 'লোকেশন' : 'Location',
      hospital: language === 'bn' ? 'হাসপাতাল' : 'Hospital',
      bags: language === 'bn' ? 'ব্যাগ' : 'Bags',
      dateLabel: language === 'bn' ? 'তারিখ লিখা' : 'Date label',
      urgent: language === 'bn' ? 'জরুরি' : 'Urgent',
      slogans: language === 'bn' ? 'স্লোগান' : 'Slogans',
    };
  }, [language]);

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

  const handleSave = () => {
    setSaved(false);
    setError(null);

    const bn = draft.notices.bn.trim();
    const en = draft.notices.en.trim();
    if (!bn || !en) {
      setError(language === 'bn' ? 'নোটিশ (বাংলা/ইংরেজি) খালি রাখা যাবে না' : 'Notice (Bangla/English) cannot be empty');
      return;
    }
    if (!draft.dashboardCards.some(c => c.enabled)) {
      setError(language === 'bn' ? 'কমপক্ষে ১টি কার্ড চালু রাখতে হবে' : 'At least 1 dashboard card must be enabled');
      return;
    }

    setConfig({
      ...draft,
      notices: { bn, en },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleReset = () => {
    resetToDefaults();
    setDraft(DEFAULT_APP_CONFIG);
    setError(null);
    setSaved(false);
  };

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      <div className="bg-green-600 pt-6 pb-10 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-2xl font-black tracking-widest uppercase text-[10px] flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>
            <h2 className="text-white text-2xl font-black tracking-tight">{labels.title}</h2>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 space-y-6">
        {/* Actions */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{labels.save}</span>
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{labels.reset}</span>
            </button>
          </div>

          <div className="min-h-[20px]">
            {saved ? (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                <Check className="w-4 h-4" />
                <span>{labels.success}</span>
              </div>
            ) : error ? (
              <div className="text-red-600 font-bold text-xs">{error}</div>
            ) : null}
          </div>
        </div>

        {/* Notice Board */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50">
          <h3 className="font-black text-gray-800 text-lg">{labels.noticeTitle}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'বাংলা এবং ইংরেজি আলাদা করে লিখুন' : 'Edit Bangla and English separately'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.bangla}</label>
              <textarea
                value={draft.notices.bn}
                onChange={(e) => setDraft(prev => ({ ...prev, notices: { ...prev.notices, bn: e.target.value } }))}
                rows={5}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.english}</label>
              <textarea
                value={draft.notices.en}
                onChange={(e) => setDraft(prev => ({ ...prev, notices: { ...prev.notices, en: e.target.value } }))}
                rows={5}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50">
          <h3 className="font-black text-gray-800 text-lg">{labels.dashboardTitle}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'কার্ড অন/অফ, অর্ডার, নাম, বর্ণনা, আইকন পরিবর্তন করুন' : 'Toggle, reorder, rename, change description and icon'}
          </p>

          <div className="space-y-4 mt-5">
            {draft.dashboardCards.map((card, idx) => {
              const defaultTitleKey = getDefaultTitleKey(card.id);
              const defaultDescKey = getDefaultDescKey(card.id);

              const defaultTitle = defaultTitleKey ? (t as any)[defaultTitleKey] : card.id;
              const defaultDesc = defaultDescKey ? (t as any)[defaultDescKey] : '';

              return (
                <div key={card.id} className="border border-gray-100 rounded-[2rem] p-5 bg-gray-50/40">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-gray-800 tracking-tight">{defaultTitle}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{card.id}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold mt-1">{labels.defaultLabel}: {defaultDesc}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => moveCard(idx, -1)}
                        className="px-3 py-2 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                        aria-label="Move up"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => moveCard(idx, 1)}
                        className="px-3 py-2 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                        aria-label="Move down"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-700" />
                      </button>

                      <label className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                        <input
                          type="checkbox"
                          checked={card.enabled}
                          onChange={(e) => updateCard(idx, { enabled: e.target.checked })}
                          className="accent-green-600"
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.icon}</label>
                        <select
                          value={card.iconKey}
                          onChange={(e) => updateCard(idx, { iconKey: e.target.value as DashboardIconKey })}
                          className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                        >
                          {ICON_OPTIONS.map(o => (
                            <option key={o.key} value={o.key}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.color}</label>
                        <input
                          value={card.color}
                          onChange={(e) => updateCard(idx, { color: e.target.value })}
                          className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                          placeholder="bg-green-600"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.lightColor}</label>
                        <input
                          value={card.lightColor}
                          onChange={(e) => updateCard(idx, { lightColor: e.target.value })}
                          className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                          placeholder="bg-green-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.overrideTitle} ({labels.bangla})</label>
                          <input
                            value={card.titleOverride?.bn ?? ''}
                            onChange={(e) => updateCard(idx, { titleOverride: { en: card.titleOverride?.en ?? '', bn: e.target.value } })}
                            className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.overrideTitle} ({labels.english})</label>
                          <input
                            value={card.titleOverride?.en ?? ''}
                            onChange={(e) => updateCard(idx, { titleOverride: { en: e.target.value, bn: card.titleOverride?.bn ?? '' } })}
                            className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.overrideDesc} ({labels.bangla})</label>
                          <input
                            value={card.descOverride?.bn ?? ''}
                            onChange={(e) => updateCard(idx, { descOverride: { en: card.descOverride?.en ?? '', bn: e.target.value } })}
                            className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{labels.overrideDesc} ({labels.english})</label>
                          <input
                            value={card.descOverride?.en ?? ''}
                            onChange={(e) => updateCard(idx, { descOverride: { en: e.target.value, bn: card.descOverride?.bn ?? '' } })}
                            className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50">
          <h3 className="font-black text-gray-800 text-lg">{labels.emergencyTitle}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'প্রতিটি সার্ভিসের নাম, বর্ণনা এবং নম্বর পরিবর্তন করুন' : 'Edit names, descriptions and phone numbers for each service'}
          </p>

          <div className="space-y-5 mt-5">
            {draft.emergencyCategories.map((cat, idx) => (
              <div key={cat.id} className="border border-gray-100 rounded-[2rem] p-4 bg-gray-50/60">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">{cat.id}</span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-2xl">
                    <input
                      type="checkbox"
                      checked={cat.enabled}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.emergencyCategories];
                          next[idx] = { ...next[idx], enabled: e.target.checked };
                          return { ...prev, emergencyCategories: next };
                        })
                      }
                      className="accent-green-600"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.overrideTitle} ({labels.bangla})
                    </label>
                    <input
                      value={cat.titleOverride?.bn ?? ''}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.emergencyCategories];
                          next[idx] = {
                            ...next[idx],
                            titleOverride: {
                              en: next[idx].titleOverride?.en ?? '',
                              bn: e.target.value,
                            },
                          };
                          return { ...prev, emergencyCategories: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.overrideTitle} ({labels.english})
                    </label>
                    <input
                      value={cat.titleOverride?.en ?? ''}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.emergencyCategories];
                          next[idx] = {
                            ...next[idx],
                            titleOverride: {
                              en: e.target.value,
                              bn: next[idx].titleOverride?.bn ?? '',
                            },
                          };
                          return { ...prev, emergencyCategories: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {cat.contacts.map((contact, cIdx) => (
                    <div key={contact.id} className="bg-white rounded-2xl border border-gray-100 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        {labels.name} #{cIdx + 1}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                            {labels.name} ({labels.bangla})
                          </label>
                          <input
                            value={contact.name.bn}
                            onChange={(e) =>
                              setDraft(prev => {
                                const next = [...prev.emergencyCategories];
                                const contacts = [...next[idx].contacts];
                                contacts[cIdx] = {
                                  ...contacts[cIdx],
                                  name: { ...contacts[cIdx].name, bn: e.target.value },
                                };
                                next[idx] = { ...next[idx], contacts };
                                return { ...prev, emergencyCategories: next };
                              })
                            }
                            className="w-full p-2.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                            {labels.name} ({labels.english})
                          </label>
                          <input
                            value={contact.name.en}
                            onChange={(e) =>
                              setDraft(prev => {
                                const next = [...prev.emergencyCategories];
                                const contacts = [...next[idx].contacts];
                                contacts[cIdx] = {
                                  ...contacts[cIdx],
                                  name: { ...contacts[cIdx].name, en: e.target.value },
                                };
                                next[idx] = { ...next[idx], contacts };
                                return { ...prev, emergencyCategories: next };
                              })
                            }
                            className="w-full p-2.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                            {labels.phone}
                          </label>
                          <input
                            value={contact.phone}
                            onChange={(e) =>
                              setDraft(prev => {
                                const next = [...prev.emergencyCategories];
                                const contacts = [...next[idx].contacts];
                                contacts[cIdx] = {
                                  ...contacts[cIdx],
                                  phone: e.target.value,
                                };
                                next[idx] = { ...next[idx], contacts };
                                return { ...prev, emergencyCategories: next };
                              })
                            }
                            className="w-full p-2.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                            {labels.description} ({labels.bangla})
                          </label>
                          <input
                            value={contact.description.bn}
                            onChange={(e) =>
                              setDraft(prev => {
                                const next = [...prev.emergencyCategories];
                                const contacts = [...next[idx].contacts];
                                contacts[cIdx] = {
                                  ...contacts[cIdx],
                                  description: { ...contacts[cIdx].description, bn: e.target.value },
                                };
                                next[idx] = { ...next[idx], contacts };
                                return { ...prev, emergencyCategories: next };
                              })
                            }
                            className="w-full p-2.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                            {labels.description} ({labels.english})
                          </label>
                          <input
                            value={contact.description.en}
                            onChange={(e) =>
                              setDraft(prev => {
                                const next = [...prev.emergencyCategories];
                                const contacts = [...next[idx].contacts];
                                contacts[cIdx] = {
                                  ...contacts[cIdx],
                                  description: { ...contacts[cIdx].description, en: e.target.value },
                                };
                                next[idx] = { ...next[idx], contacts };
                                return { ...prev, emergencyCategories: next };
                              })
                            }
                            className="w-full p-2.5 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Handmade Products */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50">
          <h3 className="font-black text-gray-800 text-lg">{labels.handmadeTitle}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'হ্যান্ডমেড প্রোডাক্টের নাম, দাম, ইউনিট, ছবি পরিবর্তন করুন' : 'Edit handmade product name, price, unit and image'}
          </p>
          <div className="space-y-4 mt-5">
            {draft.handmadeProducts.map((p, idx) => (
              <div key={p.id} className="border border-gray-100 rounded-[2rem] p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{p.id}</span>
                  <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-2xl">
                    <input
                      type="checkbox"
                      checked={p.enabled}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.handmadeProducts];
                          next[idx] = { ...next[idx], enabled: e.target.checked };
                          return { ...prev, handmadeProducts: next };
                        })
                      }
                      className="accent-green-600"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.name} ({labels.bangla})
                    </label>
                    <input
                      value={p.name.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.handmadeProducts];
                          next[idx] = { ...next[idx], name: { ...next[idx].name, bn: e.target.value } };
                          return { ...prev, handmadeProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.name} ({labels.english})
                    </label>
                    <input
                      value={p.name.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.handmadeProducts];
                          next[idx] = { ...next[idx], name: { ...next[idx].name, en: e.target.value } };
                          return { ...prev, handmadeProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.price}
                    </label>
                    <input
                      type="number"
                      value={p.price}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.handmadeProducts];
                          next[idx] = { ...next[idx], price: Number(e.target.value) || 0 };
                          return { ...prev, handmadeProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.unit} ({labels.bangla})
                    </label>
                    <input
                      value={p.unit.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.handmadeProducts];
                          next[idx] = { ...next[idx], unit: { ...next[idx].unit, bn: e.target.value } };
                          return { ...prev, handmadeProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.unit} ({labels.english})
                    </label>
                    <input
                      value={p.unit.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.handmadeProducts];
                          next[idx] = { ...next[idx], unit: { ...next[idx].unit, en: e.target.value } };
                          return { ...prev, handmadeProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      Image URL
                    </label>
                    <input
                      value={p.image}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.handmadeProducts];
                          next[idx] = { ...next[idx], image: e.target.value };
                          return { ...prev, handmadeProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50">
          <h3 className="font-black text-gray-800 text-lg">{labels.popularTitle}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'হোম পেজের পপুলার প্রোডাক্ট কার্ড এডিট করুন' : 'Edit popular products on home screen'}
          </p>
          <div className="space-y-4 mt-5">
            {draft.popularProducts.map((p, idx) => (
              <div key={p.id} className="border border-gray-100 rounded-[2rem] p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{p.id}</span>
                  <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-2xl">
                    <input
                      type="checkbox"
                      checked={p.enabled}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.popularProducts];
                          next[idx] = { ...next[idx], enabled: e.target.checked };
                          return { ...prev, popularProducts: next };
                        })
                      }
                      className="accent-green-600"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">{labels.enabled}</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.name} ({labels.bangla})
                    </label>
                    <input
                      value={p.name.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.popularProducts];
                          next[idx] = { ...next[idx], name: { ...next[idx].name, bn: e.target.value } };
                          return { ...prev, popularProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.name} ({labels.english})
                    </label>
                    <input
                      value={p.name.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.popularProducts];
                          next[idx] = { ...next[idx], name: { ...next[idx].name, en: e.target.value } };
                          return { ...prev, popularProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.price}
                    </label>
                    <input
                      value={p.price}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.popularProducts];
                          next[idx] = { ...next[idx], price: e.target.value };
                          return { ...prev, popularProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.unit} ({labels.bangla})
                    </label>
                    <input
                      value={p.unit.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.popularProducts];
                          next[idx] = { ...next[idx], unit: { ...next[idx].unit, bn: e.target.value } };
                          return { ...prev, popularProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.unit} ({labels.english})
                    </label>
                    <input
                      value={p.unit.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.popularProducts];
                          next[idx] = { ...next[idx], unit: { ...next[idx].unit, en: e.target.value } };
                          return { ...prev, popularProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.icon}
                    </label>
                    <select
                      value={p.iconKey}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.popularProducts];
                          next[idx] = { ...next[idx], iconKey: e.target.value as PopularProductIconKey };
                          return { ...prev, popularProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    >
                      {POPULAR_ICON_OPTIONS.map(o => (
                        <option key={o.key} value={o.key}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.color}
                    </label>
                    <input
                      value={p.color}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = [...prev.popularProducts];
                          next[idx] = { ...next[idx], color: e.target.value };
                          return { ...prev, popularProducts: next };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Bank Data */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-green-50">
          <h3 className="font-black text-gray-800 text-lg">{labels.bloodTitle}</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-70">
            {language === 'bn' ? 'ব্লাড ব্যাংক পেইজের স্লোগান, রিকোয়েস্ট ও ডোনার কার্ড এডিট করুন' : 'Edit slogans, requests and donor cards for blood bank'}
          </p>

          {/* Slogans */}
          <div className="mt-4 space-y-3">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              {labels.slogans}
            </p>
            {draft.blood.slogans.map((s, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                    {labels.bangla} #{idx + 1}
                  </label>
                  <input
                    value={s.bn}
                    onChange={(e) =>
                      setDraft(prev => {
                        const next = { ...prev.blood };
                        const slogans = [...next.slogans];
                        slogans[idx] = { ...slogans[idx], bn: e.target.value };
                        return { ...prev, blood: { ...next, slogans } };
                      })
                    }
                    className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                    {labels.english} #{idx + 1}
                  </label>
                  <input
                    value={s.en}
                    onChange={(e) =>
                      setDraft(prev => {
                        const next = { ...prev.blood };
                        const slogans = [...next.slogans];
                        slogans[idx] = { ...slogans[idx], en: e.target.value };
                        return { ...prev, blood: { ...next, slogans } };
                      })
                    }
                    className="w-full p-3 rounded-2xl border border-gray-200 bg-gray-50 outline-none text-sm font-bold"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Requests */}
          <div className="mt-6 space-y-3">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              {language === 'bn' ? 'জরুরি রক্তের রিকোয়েস্ট' : 'Emergency Requests'}
            </p>
            {draft.blood.requests.map((r, idx) => (
              <div key={r.id} className="border border-rose-100 rounded-[2rem] p-4 bg-rose-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {r.id} ({labels.group}: {r.group})
                  </span>
                  <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-2xl">
                    <input
                      type="checkbox"
                      checked={r.enabled}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = { ...requests[idx], enabled: e.target.checked };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="accent-red-600"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                      {labels.enabled}
                    </span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.location} ({labels.bangla})
                    </label>
                    <input
                      value={r.location.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = {
                            ...requests[idx],
                            location: { ...requests[idx].location, bn: e.target.value },
                          };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.location} ({labels.english})
                    </label>
                    <input
                      value={r.location.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = {
                            ...requests[idx],
                            location: { ...requests[idx].location, en: e.target.value },
                          };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.bags}
                    </label>
                    <input
                      type="number"
                      value={r.bags}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = { ...requests[idx], bags: Number(e.target.value) || 0 };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.hospital} ({labels.bangla})
                    </label>
                    <input
                      value={r.hospital.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = {
                            ...requests[idx],
                            hospital: { ...requests[idx].hospital, bn: e.target.value },
                          };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.hospital} ({labels.english})
                    </label>
                    <input
                      value={r.hospital.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = {
                            ...requests[idx],
                            hospital: { ...requests[idx].hospital, en: e.target.value },
                          };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.dateLabel} ({labels.bangla})
                    </label>
                    <input
                      value={r.dateLabel.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = {
                            ...requests[idx],
                            dateLabel: { ...requests[idx].dateLabel, bn: e.target.value },
                          };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.dateLabel} ({labels.english})
                    </label>
                    <input
                      value={r.dateLabel.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = {
                            ...requests[idx],
                            dateLabel: { ...requests[idx].dateLabel, en: e.target.value },
                          };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      {labels.urgent}
                    </label>
                    <input
                      type="checkbox"
                      checked={r.urgent}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const requests = [...next.requests];
                          requests[idx] = { ...requests[idx], urgent: e.target.checked };
                          return { ...prev, blood: { ...next, requests } };
                        })
                      }
                      className="accent-red-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Donors */}
          <div className="mt-6 space-y-3">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              {language === 'bn' ? 'রক্তদাতা লিস্ট' : 'Donor List'}
            </p>
            {draft.blood.donors.map((d, idx) => (
              <div key={d.id} className="border border-red-100 rounded-[2rem] p-4 bg-red-50/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {d.id} ({labels.group}: {d.group})
                  </span>
                  <label className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-2xl">
                    <input
                      type="checkbox"
                      checked={d.enabled}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const donors = [...next.donors];
                          donors[idx] = { ...donors[idx], enabled: e.target.checked };
                          return { ...prev, blood: { ...next, donors } };
                        })
                      }
                      className="accent-red-600"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                      {labels.enabled}
                    </span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.name} ({labels.bangla})
                    </label>
                    <input
                      value={d.name.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const donors = [...next.donors];
                          donors[idx] = { ...donors[idx], name: { ...donors[idx].name, bn: e.target.value } };
                          return { ...prev, blood: { ...next, donors } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.name} ({labels.english})
                    </label>
                    <input
                      value={d.name.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const donors = [...next.donors];
                          donors[idx] = { ...donors[idx], name: { ...donors[idx].name, en: e.target.value } };
                          return { ...prev, blood: { ...next, donors } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.location} ({labels.bangla})
                    </label>
                    <input
                      value={d.location.bn}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const donors = [...next.donors];
                          donors[idx] = {
                            ...donors[idx],
                            location: { ...donors[idx].location, bn: e.target.value },
                          };
                          return { ...prev, blood: { ...next, donors } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.location} ({labels.english})
                    </label>
                    <input
                      value={d.location.en}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const donors = [...next.donors];
                          donors[idx] = {
                            ...donors[idx],
                            location: { ...donors[idx].location, en: e.target.value },
                          };
                          return { ...prev, blood: { ...next, donors } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {t.lastDonation}
                    </label>
                    <input
                      value={d.lastDonation}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const donors = [...next.donors];
                          donors[idx] = { ...donors[idx], lastDonation: e.target.value };
                          return { ...prev, blood: { ...next, donors } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                      placeholder="dd-mm-yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                      {labels.phone}
                    </label>
                    <input
                      value={d.phone}
                      onChange={(e) =>
                        setDraft(prev => {
                          const next = { ...prev.blood };
                          const donors = [...next.donors];
                          donors[idx] = { ...donors[idx], phone: e.target.value };
                          return { ...prev, blood: { ...next, donors } };
                        })
                      }
                      className="w-full p-3 rounded-2xl border border-gray-200 bg-white outline-none text-sm font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, LayoutGrid, Bell, PhoneCall, ShoppingBag, Droplet, Headphones, Star, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AppConfig, DEFAULT_APP_CONFIG, useAppConfig } from '../context/AppConfigContext';

import AdminNoticeBoard from '../components/admin/AdminNoticeBoard';
import AdminDashboardCards from '../components/admin/AdminDashboardCards';
import AdminEmergency from '../components/admin/AdminEmergency';
import AdminVillageMarket from '../components/admin/AdminVillageMarket';
import AdminBloodBank from '../components/admin/AdminBloodBank';
import AdminDigitalHelpdesk from '../components/admin/AdminDigitalHelpdesk';
import AdminPopularProducts from '../components/admin/AdminPopularProducts';

type AdminView = 'home' | 'notice' | 'cards' | 'emergency' | 'market' | 'blood' | 'helpdesk' | 'popular';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { language, t } = useLanguage();
  const { config, setConfig, resetToDefaults } = useAppConfig();

  const [draft, setDraft] = useState<AppConfig>(() => config);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>('home');

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const labels = useMemo(() => {
    return {
      title: language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard',
      noticeTitle: language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board',
      helpdeskTitle: language === 'bn' ? 'ডিজিটাল হেল্পডেস্ক' : 'Digital Helpdesk',
      dashboardTitle: language === 'bn' ? 'ড্যাশবোর্ড কার্ডস (হোম)' : 'Dashboard Cards (Home)',
      emergencyTitle: language === 'bn' ? 'ইমার্জেন্সি কন্টাক্ট' : 'Emergency Contacts',
      handmadeTitle: language === 'bn' ? 'গ্রামের বাজার (মার্কেট)' : 'Village Market',
      popularTitle: language === 'bn' ? 'পপুলার প্রোডাক্ট' : 'Popular Products',
      bloodTitle: language === 'bn' ? 'ব্লাড ব্যাংক' : 'Blood Bank Data',
      english: language === 'bn' ? 'ইংরেজি' : 'English',
      bangla: language === 'bn' ? 'বাংলা' : 'Bangla',
      save: language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes',
      reset: language === 'bn' ? 'ডিফল্টে ফেরত' : 'Reset to defaults',
      enabled: language === 'bn' ? 'চালু' : 'Enabled',
      icon: language === 'bn' ? 'আইকন' : 'Icon',
      color: language === 'bn' ? 'কালার' : 'Color',
      lightColor: language === 'bn' ? 'লাইট কালার' : 'Light color',
      overrideTitle: language === 'bn' ? 'শিরোনাম (Override)' : 'Title override',
      overrideDesc: language === 'bn' ? 'বর্ণনা (Override)' : 'Description',
      defaultLabel: language === 'bn' ? 'ডিফল্ট' : 'Default',
      success: language === 'bn' ? 'সফলভাবে সেভ হয়েছে!' : 'Saved Successfully!',
      name: language === 'bn' ? 'নাম' : 'Name',
      description: language === 'bn' ? 'বর্ণনা' : 'Description',
      phone: language === 'bn' ? 'ফোন' : 'Phone',
      unit: language === 'bn' ? 'ইউনিট' : 'Unit',
      price: language === 'bn' ? 'দাম' : 'Price',
      group: language === 'bn' ? 'গ্রুপ' : 'Group',
      location: language === 'bn' ? 'লোকেশন' : 'Location',
      hospital: language === 'bn' ? 'হাসপাতাল' : 'Hospital',
      bags: language === 'bn' ? 'ব্যাগ' : 'Bags',
      dateLabel: language === 'bn' ? 'তারিখ টেক্সট' : 'Date label',
      urgent: language === 'bn' ? 'জরুরি' : 'Urgent',
    };
  }, [language]);

  const handleSave = () => {
    setSaved(false);
    setError(null);

    const bn = draft.notices.bn.trim();
    const en = draft.notices.en.trim();
    if (!bn || !en) {
      setError(language === 'bn' ? 'নোটিশ (বাংলা/ইংরেজি) খালি রাখা যাবে না' : 'Notice cannot be empty');
      return;
    }
    
    setConfig({
      ...draft,
      notices: { bn, en },
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setActiveView('home'); // Go back to home after save
    }, 1500);
  };

  const handleReset = () => {
    if(!window.confirm(language === 'bn' ? 'আপনি কি ডাটা অরিজিনাল অবস্থায় ফেরত নিতে চান?' : 'Are you sure you want to reset everything?')) return;
    resetToDefaults();
    setDraft(DEFAULT_APP_CONFIG);
    setError(null);
    setSaved(false);
    setActiveView('home');
  };

  const adminMenuIcons = [
    { id: 'notice', label: labels.noticeTitle, icon: Bell, color: 'bg-amber-500', light: 'bg-amber-50' },
    { id: 'cards', label: labels.dashboardTitle, icon: LayoutGrid, color: 'bg-indigo-500', light: 'bg-indigo-50' },
    { id: 'emergency', label: labels.emergencyTitle, icon: PhoneCall, color: 'bg-rose-500', light: 'bg-rose-50' },
    { id: 'market', label: labels.handmadeTitle, icon: ShoppingBag, color: 'bg-emerald-500', light: 'bg-emerald-50' },
    { id: 'blood', label: labels.bloodTitle, icon: Droplet, color: 'bg-red-600', light: 'bg-red-50' },
    { id: 'helpdesk', label: labels.helpdeskTitle, icon: Headphones, color: 'bg-cyan-500', light: 'bg-cyan-50' },
    { id: 'popular', label: labels.popularTitle, icon: Star, color: 'bg-blue-500', light: 'bg-blue-50' },
  ] as const;

  const sharedProps = { draft, setDraft, language, t, labels, onSave: handleSave, onBack: () => setActiveView('home') };

  return (
    <div className="pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-green-600 pt-8 pb-10 px-6 rounded-b-[3.5rem] shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center mb-6">
          <button onClick={onBack} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white text-2xl font-black mx-auto pr-8">{labels.title}</h2>
        </div>
        
        {activeView === 'home' && (
          <p className="text-green-100 font-bold uppercase tracking-widest text-[10px] relative z-10 opacity-90 pb-2">
            {language === 'bn' ? 'যেকোনো কার্ড সিলেক্ট করে মেইনটেইন করুন' : 'Select a card to manage module'}
          </p>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-lg mb-6 flex items-center justify-between">
            <p className="text-red-700 text-sm font-bold">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold">×</button>
          </div>
        )}
        
        {saved && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl shadow-lg mb-6 flex items-center shadow-green-900/10 animate-in slide-in-from-top-4">
            <div className="bg-green-500 rounded-full p-1 mr-3"><Check className="w-4 h-4 text-white" /></div>
            <p className="text-green-700 text-sm font-bold">{labels.success}</p>
          </div>
        )}

        {/* Dashboard Grid View */}
        {activeView === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {adminMenuIcons.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as AdminView)}
                  className={`p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 transition-all transform hover:shadow-xl hover:-translate-y-1 active:scale-95 shadow-sm border border-transparent hover:border-white ${item.light} group min-h-[160px]`}
                >
                  <div className={`${item.color} p-4 rounded-3xl text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 text-[13px] sm:text-base leading-none tracking-tight">{item.label}</h3>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-red-50 text-center mt-10">
              <p className="text-xs text-gray-500 font-bold mb-3">
                {language === 'bn' ? 'সবকিছু আগের অবস্থায় ফিরিয়ে নিতে' : 'Reset all settings to default'}
              </p>
              <button onClick={handleReset} className="mx-auto w-full max-w-xs border-2 border-dashed border-red-200 text-red-500 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                <RotateCcw className="w-4 h-4" />
                {labels.reset}
              </button>
            </div>
          </div>
        )}

        {/* Sub Views */}
        {activeView === 'notice' && <AdminNoticeBoard {...sharedProps} />}
        {activeView === 'cards' && <AdminDashboardCards {...sharedProps} />}
        {activeView === 'emergency' && <AdminEmergency {...sharedProps} />}
        {activeView === 'market' && <AdminVillageMarket {...sharedProps} />}
        {activeView === 'blood' && <AdminBloodBank {...sharedProps} />}
        {activeView === 'helpdesk' && <AdminDigitalHelpdesk {...sharedProps} />}
        {activeView === 'popular' && <AdminPopularProducts {...sharedProps} />}

      </div>
    </div>
  );
};

export default AdminPanel;

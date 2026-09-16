
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppConfig } from '../context/AppConfigContext';
import { 
  Flag, 
  HelpCircle, 
  Landmark, 
  UserPlus, 
  ExternalLink,
  ChevronRight,
  Headphones,
  X,
  ArrowLeft,
  Camera,
  Send,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

type SubView = 'menu' | 'complaint' | 'info' | 'volunteer' | 'success';

const HelpdeskCard: React.FC = () => {
  const { t, language } = useLanguage();
  const { config } = useAppConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<SubView>('menu');
  const [complaintText, setComplaintText] = useState('');
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerReason, setVolunteerReason] = useState('');

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleAction = (id: string) => {
    if (id === 'complaint') setActiveView('complaint');
    else if (id === 'info') setActiveView('info');
    else if (id === 'volunteer') setActiveView('volunteer');
    else if (id === 'govt') handleExternalLink('https://surokkha.gov.bd');
    else if (id === 'links') handleExternalLink('https://bangladesh.gov.bd');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setActiveView('menu');
      setComplaintText('');
      setVolunteerName('');
      setVolunteerReason('');
    }, 300);
  };

  const handleSubmit = () => {
    // Here you would typically send data to backend
    // For now, just show success
    setActiveView('success');
  };

  const subServices = [
    {
      id: 'complaint',
      title: t.subComplaint,
      desc: t.subComplaintDesc,
      icon: Flag,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 'info',
      title: t.subInfo,
      desc: t.subInfoDesc,
      icon: HelpCircle,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'govt',
      title: t.subGovt,
      desc: t.subGovtDesc,
      icon: Landmark,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'volunteer',
      title: t.subVolunteer,
      desc: t.subVolunteerDesc,
      icon: UserPlus,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'links',
      title: t.subLinks,
      desc: t.subLinksDesc,
      icon: ExternalLink,
      color: 'bg-orange-100 text-orange-600',
    }
  ];

  const activeServices = subServices.map(s => {
    const overrideSource = config.helpdesk.services.find(x => x.id === s.id);
    const enabled = overrideSource ? overrideSource.enabled : true;
    const ov = overrideSource?.titleOverride;
    const titleOverrideStr = language === 'bn' ? ov?.bn : ov?.en;
    return {
      ...s,
      enabled,
      title: titleOverrideStr?.trim() ? titleOverrideStr : s.title,
    };
  }).filter(s => s.enabled);

  const renderModalContent = () => {
    switch (activeView) {
      case 'complaint':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-black text-gray-800">{t.subComplaint}</h3>
            <textarea 
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="w-full h-32 p-4 rounded-3xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none resize-none text-sm transition-all"
              placeholder={t.complaintText}
            />
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-red-300 hover:bg-red-50/10 transition-all cursor-pointer">
              <Camera className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.attachPhoto}</span>
            </div>
            <button 
              onClick={handleSubmit}
              disabled={!complaintText.trim()}
              className="w-full bg-red-600 text-white py-4 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{t.submit}</span>
            </button>
          </div>
        );
      case 'info':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-black text-gray-800 mb-4">{t.subInfo}</h3>
            <div className="space-y-3">
              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                <p className="font-extrabold text-blue-900 text-sm mb-2">Q: {t.infoQ1}</p>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">A: {t.infoA1}</p>
              </div>
              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                <p className="font-extrabold text-blue-900 text-sm mb-2">Q: {t.infoQ2}</p>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">A: {t.infoA2}</p>
              </div>
              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                <p className="font-extrabold text-blue-900 text-sm mb-2">Q: {t.infoQ3}</p>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">A: {t.infoA3}</p>
              </div>
              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100">
                <p className="font-extrabold text-blue-900 text-sm mb-2">Q: {t.infoQ4}</p>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">A: {t.infoA4}</p>
              </div>
            </div>
          </div>
        );
      case 'volunteer':
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-black text-gray-800">{t.subVolunteer}</h3>
            <div className="space-y-4">
               <input 
                type="text" 
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold transition-all" 
                placeholder={t.name} 
              />
               <textarea 
                value={volunteerReason}
                onChange={(e) => setVolunteerReason(e.target.value)}
                className="w-full h-24 p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm font-medium transition-all"
                placeholder={t.volunteerReason}
              />
            </div>
            <button 
              onClick={handleSubmit}
              disabled={!volunteerName.trim() || !volunteerReason.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.btnJoin}</span>
            </button>
          </div>
        );
      case 'success':
        return (
          <div className="text-center py-12 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-600 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-green-900 leading-tight">{t.successTitle}</h3>
            <p className="text-gray-500 mt-2 text-sm font-medium">{t.successMessage}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button 
                onClick={() => setActiveView('menu')}
                className="bg-gray-100 text-gray-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.back}</span>
              </button>
              <button 
                onClick={handleClose}
                className="bg-green-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-green-700 transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeServices.map((service) => (
              <article
                key={service.id}
                className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/90 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-100/60 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                <div className="relative p-5">
                  <div className={`${service.color} w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-gray-800 text-base leading-tight">{service.title}</h4>
                  <p className="text-[11px] text-gray-500 font-bold mt-2 uppercase tracking-tight">{service.desc}</p>
                  <button
                    type="button"
                    onClick={() => handleAction(service.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    Open
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="mt-3 h-1.5 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 opacity-70" />
                </div>
              </article>
            ))}
          </div>
        );
    }
  };

  return (
    <>
      {/* Trigger Card */}
      <div 
        onClick={() => { setIsOpen(true); setActiveView('menu'); }}
        className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-emerald-900/30 col-span-full cursor-pointer hover:shadow-emerald-900/40 hover:-translate-y-1 transition-all group relative overflow-hidden"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(true);
            setActiveView('menu');
          }
        }}
      >
        <div className="absolute -top-12 -right-10 w-48 h-48 bg-white/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
        <div className="absolute -bottom-16 -left-12 w-56 h-56 bg-emerald-300/20 rounded-full blur-3xl"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-3xl shadow-lg group-hover:rotate-12 transition-transform">
              <Headphones className="text-white w-7 h-7" />
            </div>
            <div className="pr-4">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Service Hub
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">{t.helpdesk}</h2>
              <p className="text-[11px] sm:text-xs text-emerald-100 font-black uppercase tracking-widest mt-0.5">{t.helpdeskDesc}</p>
            </div>
          </div>
          <div className="flex-shrink-0 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-2xl text-white group-hover:bg-white group-hover:text-emerald-600 transition-all">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={handleClose}
          ></div>
          
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-2xl max-h-[92vh] rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-10 duration-300 border border-white/60 flex flex-col">
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-5 flex items-center justify-between border-b border-emerald-50 bg-gradient-to-r from-emerald-50/70 to-white shrink-0">
              <div className="flex items-center space-x-3">
                {activeView !== 'menu' && activeView !== 'success' && (
                  <button 
                    onClick={() => setActiveView('menu')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center space-x-2 group"
                    aria-label={t.back}
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-green-600 group-hover:-translate-x-1 transition-all" />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-green-600 hidden sm:block">{t.back}</span>
                  </button>
                )}
                {activeView === 'menu' && (
                  <button 
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center space-x-2 group"
                    aria-label={t.back}
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-green-600 group-hover:-translate-x-1 transition-all" />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-green-600 hidden sm:block">{t.back}</span>
                  </button>
                )}
                <span className="font-black text-emerald-600 uppercase tracking-[0.2em] text-[10px]">
                  {activeView === 'menu' ? t.helpdesk : activeView === 'success' ? t.successTitle : ''}
                </span>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={t.close}
              >
                <X className="w-6 h-6 text-gray-300 hover:text-gray-600 transition-colors" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-gradient-to-b from-white to-emerald-50/30">
              {renderModalContent()}
            </div>

            <div className="px-8 pb-8 text-center shrink-0">
              <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">
                Premium Helpdesk Suite
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpdeskCard;

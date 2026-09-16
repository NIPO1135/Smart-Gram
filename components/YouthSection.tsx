import React, { useState } from 'react';
import { GraduationCap, Wallet, Rocket, ArrowRight, Lock, CheckCircle2, ShieldCheck, TrendingUp, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const YouthSection: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const { user, updateYouthProgress } = useAuth();
  
  // States
  const [modalMode, setModalMode] = useState<{ isOpen: boolean; message: string; subText: string; actionText: string; targetId: string } | null>(null);

  const youthProgress = user?.youthProgress || {
    learnProgress: 0,
    earnCompleted: false,
    growUnlocked: false
  };

  const learnProgress = youthProgress.learnProgress;
  const earnCompleted = youthProgress.earnCompleted;
  const growUnlocked = youthProgress.growUnlocked;

  // Locks logic map
  const isEarnUnlocked = learnProgress >= 80;
  const isGrowUnlocked = earnCompleted;

  // Actions for Dev Simulation
  const simulateLearn = async () => {
    const newProgress = Math.min(learnProgress + 20, 100);
    await updateYouthProgress({ learnProgress: newProgress });
  };

  const simulateEarn = async () => {
    await updateYouthProgress({ earnCompleted: true, growUnlocked: true });
  };

  // Cards Definition
  const cards = [
    {
      id: 'learn',
      icon: GraduationCap,
      text: 'শিখুন নতুন দক্ষতা',
      sub: 'AI Tutor, Course, Video',
      button: 'Start Learning',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      gradient: 'from-blue-600 to-indigo-600',
      locked: false,
      lockMsg: '',
      progress: learnProgress,
      stateLabel: learnProgress >= 100 ? 'Completed 🎉' : `${learnProgress}% Ready`
    },
    {
      id: 'earn',
      icon: Wallet,
      text: 'আয় শুরু করুন',
      sub: 'Job, Freelance, Local Work',
      button: 'Start Earning',
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      gradient: 'from-emerald-500 to-teal-500',
      locked: !isEarnUnlocked,
      lockMsg: 'Learn অন্তত ৮০% সম্পন্ন করলে এটি unlock হবে',
      stateLabel: isEarnUnlocked ? 'Unlocked 🎉' : `Learn Progress: ${learnProgress}%`
    },
    {
      id: 'grow',
      icon: Rocket,
      text: 'নিজেকে উন্নত করুন',
      sub: 'Career, Progress, Business',
      button: 'Grow Now',
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      gradient: 'from-orange-500 to-amber-500',
      locked: !isGrowUnlocked,
      lockMsg: 'Earn ধাপ সম্পন্ন করলে এটি unlock হবে',
      stateLabel: isGrowUnlocked ? 'Unlocked 🎉' : 'Locked'
    }
  ];

  const handleCardClick = (card: typeof cards[0]) => {
    if (card.locked) {
      if (card.id === 'earn') {
        setModalMode({
          isOpen: true,
          message: 'এই section ব্যবহার করতে হলে আগের ধাপ সম্পন্ন করুন',
          subText: 'Learn ধাপটি অন্তত ৮০% শেষ করুন।',
          actionText: 'Continue Learning',
          targetId: 'learn'
        });
      } else if (card.id === 'grow') {
        setModalMode({
          isOpen: true,
          message: 'এই section ব্যবহার করতে হলে আগের ধাপ সম্পন্ন করুন',
          subText: 'Earn ধাপে অন্তত ১টি কাজ সম্পন্ন করুন।',
          actionText: 'Start Earning',
          targetId: 'earn'
        });
      }
    } else {
      if (card.id === 'learn') {
        onNavigate?.('youthLearn');
      }
    }
  };

  return (
    <div className="mb-6 px-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
      
      {/* Header and Gamification Badges */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-black text-gray-800 border-l-4 border-indigo-500 pl-3 leading-none flex items-center gap-2">
            SmartGram Youth 
          </h3>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">
            Journey
          </span>
        </div>

        {/* Gamification Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {learnProgress >= 100 && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" /> Learner Completed
            </div>
          )}
          {earnCompleted && (
            <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" /> First Income
            </div>
          )}
          {growUnlocked && (
            <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" /> Growth Starter
            </div>
          )}
        </div>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-4 snap-x no-scrollbar">
        {cards.map((card) => {
          const isLocked = card.locked;

          return (
            <div 
              key={card.id} 
              onClick={() => handleCardClick(card)}
              className={`flex-shrink-0 w-[260px] rounded-[2.5rem] p-6 shadow-lg border-2 border-white snap-start relative overflow-hidden group transition-all flex flex-col ${card.lightColor} ${isLocked ? 'opacity-80 cursor-pointer' : 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer'}`}
            >
              {isLocked && (
                 <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-white/90 p-3 rounded-full shadow-lg mb-2">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-[10px] font-black text-gray-600 bg-white/80 px-3 py-1 rounded-full text-center mx-4 uppercase tracking-wider">{card.lockMsg}</p>
                 </div>
              )}

              {/* Decorative background blur */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-20 rounded-full blur-2xl -mr-10 -mt-10 ${!isLocked && 'group-hover:scale-150'} transition-transform duration-700`}></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-40 rounded-full blur-xl -ml-8 -mb-8"></div>
              
              {/* Top Row: Icon and Status Badge */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-[1.2rem] bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg shadow-black/10 ${!isLocked && 'group-hover:rotate-12 group-hover:scale-110'} transition-transform duration-300`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-sm ${!isLocked && card.id !== 'learn' ? 'bg-green-100 text-green-700' : 'bg-white/60 text-gray-500'}`}>
                  {card.stateLabel}
                </div>
              </div>

              {/* Texts */}
              <div className="relative z-10 flex-1">
                <h4 className="text-[19px] font-black text-gray-800 leading-tight mb-2 flex items-center gap-2">
                  {card.text}
                </h4>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed opacity-80 mb-4">{card.sub}</p>
                
                {card.id === 'learn' && (
                  <div className="mb-4">
                    <div className="w-full bg-blue-200/50 rounded-full h-1.5 mb-1 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${learnProgress}%` }}></div>
                    </div>
                    <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">আপনি {learnProgress}% ready আয় শুরু করার জন্য</p>
                    {/* Only for demo purposes to simulate progress */}
                    <button onClick={(e) => { e.stopPropagation(); simulateLearn(); }} className="mt-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded shadow-sm hover:bg-blue-200">
                      Simulate Progress (+20%)
                    </button>
                  </div>
                )}

                {card.id === 'earn' && !isLocked && !earnCompleted && (
                  <div className="mb-2">
                    <button onClick={(e) => { e.stopPropagation(); simulateEarn(); }} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded shadow-sm hover:bg-emerald-200">
                      Simulate Job Complete
                    </button>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button disabled={isLocked} className={`relative z-10 w-full py-3.5 bg-white rounded-2xl text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm border border-black/5 transition-all text-gray-700 ${!isLocked ? `hover:bg-gradient-to-r hover:${card.gradient} hover:text-white group/btn` : 'opacity-50'}`}>
                {card.button}
                {!isLocked && <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
              </button>
            </div>
          );
        })}
        {/* Extra spacer for scroll */}
        <div className="flex-shrink-0 w-2"></div>
      </div>

      {/* Lock Popup Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-black text-center text-gray-800 mb-2">{modalMode.message}</h3>
            <p className="text-sm font-bold text-gray-500 text-center mb-6">{modalMode.subText}</p>
            
            <button 
              onClick={() => setModalMode(null)} // In a real app, this could scroll to the target card
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl shadow-black/20 hover:-translate-y-1 transition-transform"
            >
              {modalMode.actionText}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default YouthSection;

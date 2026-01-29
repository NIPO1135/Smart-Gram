
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, 
  Trophy, 
  PlayCircle, 
  Calendar, 
  TrendingUp, 
  Activity,
  ChevronRight,
  Radio,
  Video,
  Zap,
  MapPin
} from 'lucide-react';

const SportsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useLanguage();

  const handleWatchLive = () => {
    // Standard link for Cricfy TV web streaming
    window.open('https://cricfytv.com/', '_blank');
  };

  const scores = [
    { 
      event: language === 'bn' ? 'বাংলাদেশ বনাম ভারত' : 'Bangladesh vs India', 
      type: t.cricket, 
      score: '154/4 (20.0)', 
      status: language === 'bn' ? 'ম্যাচ শেষ' : 'Match Ended' 
    },
    { 
      event: language === 'bn' ? 'আর্জেন্টিনা বনাম ব্রাজিল' : 'Argentina vs Brazil', 
      type: t.football, 
      score: '2 - 1', 
      status: language === 'bn' ? '৭০ মিনিট' : '70 Mins' 
    }
  ];

  const events = [
    { 
      name: language === 'bn' ? 'গ্রামের ফুটবল টুর্নামেন্ট' : 'Village Football Tournament', 
      date: 'Dec 15, 2024', 
      venue: language === 'bn' ? 'স্কুল মাঠ' : 'School Ground' 
    },
    { 
      name: language === 'bn' ? 'ব্যাডমিন্টন কাপ' : 'Badminton Cup', 
      date: 'Dec 22, 2024', 
      venue: language === 'bn' ? 'ক্লাব প্রাঙ্গন' : 'Club Yard' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 pb-44 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-4 pt-6 pb-5 sticky top-0 z-40 border-b-2 border-indigo-200 shadow-sm">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={onBack} className="p-2 hover:bg-indigo-100 rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-6 h-6 text-indigo-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{t.sportsTitle}</h2>
            <p className="text-xs text-indigo-600 mt-1">
              {language === 'bn' ? 'লাইভ ম্যাচ দেখুন এবং স্কোর আপডেট পান' : 'Watch live matches and get score updates'}
            </p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-2xl">
            <Trophy className="w-7 h-7 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-2xl mx-auto">
        
        {/* Watch Live Section (Cricfy TV) - Prominent and Beautiful */}
        <div className="space-y-4">
          <div className="mb-4 px-2">
            <p className="text-sm text-gray-600 font-medium">
              {language === 'bn' ? '🎥 সরাসরি ক্রিকেট ও ফুটবল ম্যাচ দেখুন' : '🎥 Watch live cricket and football matches'}
            </p>
          </div>
          <button 
            onClick={handleWatchLive}
            className="w-full bg-gradient-to-br from-red-600 via-red-700 to-rose-800 rounded-[3rem] p-10 text-center shadow-2xl shadow-red-600/40 hover:shadow-red-600/60 hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden border-4 border-white"
          >
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent"></div>
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-5">
              <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md border-2 border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all shadow-xl">
                <Video className="w-14 h-14 text-white fill-white/30" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {t.watchLive}
                  </h3>
                  <Radio className="w-5 h-5 text-red-200 animate-pulse" />
                </div>
                <p className="text-slate-200 text-sm font-bold uppercase tracking-wider mt-2 group-hover:text-white">
                  {t.enjoyMatches}
                </p>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-white border border-white/30">
                    {language === 'bn' ? '🔴 লাইভ' : '🔴 LIVE'}
                  </span>
                  <span className="text-xs text-white/80 font-medium">
                    {language === 'bn' ? 'Cricfy TV' : 'Cricfy TV'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Latest Scores Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center mb-1">
                <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                {t.latestScores}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'bn' ? 'সর্বশেষ ম্যাচের ফলাফল' : 'Latest match results'}
              </p>
            </div>
            <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-full uppercase">{t.scoreUpdate}</span>
          </div>
          <div className="grid gap-4">
            {scores.map((score, idx) => (
              <div key={idx} className="bg-gradient-to-br from-white to-indigo-50/30 rounded-3xl p-6 border-2 border-indigo-100 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-base mb-1">{score.event}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full font-bold uppercase">
                          {score.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-black text-slate-900 mb-2">{score.score}</p>
                    <p className={`text-xs font-black px-3 py-1.5 rounded-full inline-block uppercase ${
                      score.status === (language === 'bn' ? 'ম্যাচ শেষ' : 'Match Ended')
                        ? 'text-gray-600 bg-gray-100'
                        : 'text-red-600 bg-red-100 animate-pulse'
                    }`}>
                      {score.status === (language === 'bn' ? 'ম্যাচ শেষ' : 'Match Ended') 
                        ? (language === 'bn' ? '✓ শেষ' : '✓ Ended')
                        : `🔴 ${score.status}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Village Events */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 px-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-lg font-black text-slate-800">
                {t.upcomingEvents}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'bn' ? 'আসন্ন গ্রামীণ খেলাধুলা' : 'Upcoming village sports'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {events.map((event, idx) => (
              <div key={idx} className="bg-gradient-to-br from-white to-amber-50/30 rounded-3xl p-6 border-2 border-amber-100 shadow-lg hover:shadow-xl transition-all group cursor-pointer hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-2xl text-amber-600 group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-base mb-1">{event.name}</h4>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-xs text-gray-600 font-bold">{event.venue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-4 py-2 rounded-full uppercase border border-amber-200">
                      {event.date}
                    </span>
                    <ChevronRight className="w-5 h-5 text-amber-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SportsPage;

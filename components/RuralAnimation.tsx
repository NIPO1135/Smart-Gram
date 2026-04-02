
import React from 'react';
import { Sprout, Home, TreePine, Sun, Cloud, Film, Radio, Bike, Box } from 'lucide-react';

const RuralAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Sun - top right */}
      <div className="absolute top-2 right-4 sm:top-4 sm:right-8 animate-pulse" style={{ animationDuration: '2.5s' }}>
        <Sun className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-200 opacity-70" />
      </div>

      {/* Clouds - scattered */}
      <div className="absolute top-3 right-12 sm:top-6 sm:right-20 animate-bounce" style={{ animationDuration: '3s' }}>
        <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-white/35" />
      </div>
      <div className="absolute top-6 right-24 sm:top-10 sm:right-32 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-white/25" />
      </div>
      <div className="absolute top-2 right-1/3 animate-bounce hidden sm:block" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <Cloud className="w-5 h-5 text-white/20" />
      </div>

      {/* ========== 90s Kids Nostalgia - MIDDLE SECTION ========== */}
      {/* Bioscope (বায়োস্কোপ) - old peep show viewer */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce" 
        style={{ animationDuration: '2.5s', marginLeft: '-20px' }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30 shadow-lg">
          <Film className="w-8 h-8 sm:w-10 sm:h-10 text-white/90" />
        </div>
        <div className="w-2 h-4 sm:w-3 sm:h-5 bg-amber-200/60 rounded-b-full mt-1" />
      </div>

      {/* Gorur Gari (গোরুর গাড়ি) - bullock cart */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-0 gorur-gari-anim" 
        style={{ marginBottom: '4px' }}
      >
        <div className="flex flex-col items-center">
          <Box className="w-8 h-5 sm:w-10 sm:h-6 text-amber-100/80" />
          <div className="flex gap-2 mt-0.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-200/70 border border-amber-300/50" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-200/70 border border-amber-300/50" />
          </div>
        </div>
      </div>

      {/* Radio (ট্রানজিস্টর) - 90s transistor */}
      <div 
        className="absolute left-[35%] top-[45%] sm:left-[38%] sm:top-[40%] animate-pulse" 
        style={{ animationDuration: '2s', animationDelay: '0.5s' }}
      >
        <div className="bg-white/15 rounded-md p-1.5 border border-white/25">
          <Radio className="w-6 h-6 sm:w-7 sm:h-7 text-white/80" />
        </div>
      </div>

      {/* Bicycle (সাইকেল) - 90s cycle */}
      <div 
        className="absolute right-[35%] top-[48%] sm:right-[38%] sm:top-[42%] animate-bounce" 
        style={{ animationDuration: '3s', animationDelay: '1s' }}
      >
        <Bike className="w-7 h-7 sm:w-8 sm:h-8 text-white/70" />
      </div>

      {/* Kite / Patang - simple diamond shape (CSS) */}
      <div 
        className="absolute left-[45%] top-6 sm:top-8 animate-bounce" 
        style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}
      >
        <div 
          className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-white/40"
          style={{ transform: 'rotate(0deg)' }}
        />
      </div>

      {/* Trees - bottom area */}
      <div className="absolute bottom-2 right-4 sm:bottom-4 sm:right-12 animate-pulse" style={{ animationDuration: '2s' }}>
        <TreePine className="w-8 h-8 sm:w-10 sm:h-10 text-green-300 opacity-80" />
      </div>
      <div className="absolute bottom-4 right-14 sm:bottom-6 sm:right-24 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
        <TreePine className="w-6 h-6 sm:w-8 sm:h-8 text-green-200 opacity-70" />
      </div>
      <div className="absolute bottom-3 right-24 sm:bottom-8 sm:right-36 animate-pulse" style={{ animationDuration: '2.2s', animationDelay: '1s' }}>
        <TreePine className="w-7 h-7 sm:w-9 sm:h-9 text-green-200 opacity-60" />
      </div>
      <div className="absolute bottom-6 right-8 sm:right-16 animate-pulse" style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}>
        <TreePine className="w-5 h-5 sm:w-7 sm:h-7 text-green-100 opacity-50" />
      </div>

      {/* Houses - rural */}
      <div className="absolute bottom-4 right-6 sm:bottom-8 sm:right-16 animate-bounce" style={{ animationDuration: '3s' }}>
        <Home className="w-7 h-7 sm:w-9 sm:h-9 text-white/50" />
      </div>
      <div className="absolute bottom-6 right-16 sm:bottom-10 sm:right-28 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
        <Home className="w-5 h-5 sm:w-7 sm:h-7 text-white/40" />
      </div>
      <div className="absolute bottom-5 right-32 sm:right-44 animate-bounce hidden sm:block" style={{ animationDuration: '3.2s', animationDelay: '0.6s' }}>
        <Home className="w-6 h-6 text-white/35" />
      </div>

      {/* Plants/Sprouts */}
      <div className="absolute bottom-2 right-10 sm:bottom-12 sm:right-20 animate-pulse" style={{ animationDuration: '1.5s' }}>
        <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-green-200 opacity-60" />
      </div>
      <div className="absolute bottom-3 right-20 sm:bottom-14 sm:right-36 animate-pulse" style={{ animationDuration: '1.8s', animationDelay: '0.8s' }}>
        <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-green-100 opacity-50" />
      </div>
      <div className="absolute bottom-4 left-8 sm:left-16 animate-pulse" style={{ animationDuration: '1.6s', animationDelay: '0.4s' }}>
        <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-green-100 opacity-45" />
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/25 rounded-full animate-ping"
          style={{
            left: `${15 + i * 12}%`,
            top: `${25 + (i % 3) * 25}%`,
            animationDuration: `${2 + i * 0.4}s`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}

      <style>{`
        .gorur-gari-anim {
          animation: gorur-gari-move 3s ease-in-out infinite;
        }
        @keyframes gorur-gari-move {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(calc(-50% - 6px)) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RuralAnimation;

import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Radio, MapPin, AlertTriangle, Mic, VolumeX, Volume2, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SosData {
  user: { name: string; phone: string };
  coordinates: { lat: number; lng: number } | null;
  threatLevel: string;
  source: string;
  message?: string;
  timestamp: number;
}

const AIGramPahara: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sosList, setSosList] = useState<SosData[]>([]);
  const [muted, setMuted] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    // Setup Global SSE Listener
    eventSourceRef.current = new EventSource(`${API_BASE_URL}/api/sos/stream`);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'sync') {
        setSosList(data.emergencies);
        
        if (data.emergencies.length > 0) {
          setIsActive(true);
          if (audioRef.current && !muted) {
            audioRef.current.play().catch(e => console.log('Audio playback prevented by browser:', e));
          }
        } else {
          setIsActive(false);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
      }
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [API_BASE_URL, muted]);

  const triggerSOS = async (source: string) => {
    // Optimistically set active for instantaneous feedback
    setIsActive(true);
    
    let coords = null;
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
        });
        coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      } catch (error) {
        console.log('Geolocation error:', error);
      }
    }

    try {
      await fetch(`${API_BASE_URL}/api/sos/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { 
            name: currentUser?.name || 'Unknown User', 
            phone: currentUser?.phone || 'Unknown Phone' 
          },
          coordinates: coords,
          threatLevel: 'High',
          source,
          message: customMessage
        })
      });
      setCustomMessage('');
    } catch (e) {
      console.error("Failed to trigger SOS globally", e);
    }
  };

  const cancelSOS = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/sos/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: currentUser?.phone })
      });
    } catch (e) {
      console.error("Failed to cancel SOS", e);
    }
  };

  useEffect(() => {
    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'bn-BD';

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (
          transcript.includes('বাঁচাও') || 
          transcript.includes('ডাকাত') || 
          transcript.includes('help')
        ) {
          triggerSOS('voice');
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
      if (isListening) {
        try { recognition.start(); } catch (e) {}
      }
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isListening, currentUser]);

  const toggleVoiceListen = () => {
    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
    } else {
      setIsListening(true);
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch(e) {}
      }
    }
  };

  return (
    <div className="w-full relative z-30 flex flex-col items-center">
      <audio 
        ref={audioRef} 
        src="/siren.mp3" 
        loop 
        preload="auto"
      />

      {!isActive ? (
        <div className="relative group w-full max-w-sm flex flex-col gap-3">
          
          {isConfirming ? (
            <div className="relative bg-[#111] backdrop-blur-xl border border-red-500/50 p-6 rounded-3xl shadow-[0_0_30px_rgba(220,38,38,0.3)] animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-500/20 p-3 rounded-full mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">TRIGGER SOS?</h3>
                <p className="text-gray-400 text-sm mb-6">This will instantly alert everyone in the platform with your live location.</p>
                
                <div className="w-full relative bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 shadow-inner">
                  <input 
                    type="text" 
                    placeholder="Short message (e.g. Fire, Medical)..." 
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 font-medium"
                    maxLength={60}
                  />
                </div>

                <div className="flex w-full gap-3">
                  <button 
                    onClick={() => setIsConfirming(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setIsConfirming(false);
                      triggerSOS('manual');
                    }}
                    className="flex-1 py-3 rounded-xl font-black text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-colors"
                  >
                    SEND ALERT
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Glassmorphic Container for the Trigger */}
              <div className="relative w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-3xl blur-md opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-2 sm:p-3 rounded-3xl shadow-2xl flex items-center justify-between">
                
                <button
                  onClick={() => setIsConfirming(true)}
                  className="relative flex-1 bg-gradient-to-r from-red-600 to-red-800 text-white py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 overflow-hidden group/btn"
                >
                  {/* Sweeping Light Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000"></div>
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                      <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8 relative z-10 drop-shadow-md" />
                    </div>
                    <span className="tracking-widest uppercase drop-shadow-md">AI Gram Pahara</span>
                  </div>
                </button>
                
                {/* Mic Toggle Separated */}
                <button 
                  onClick={toggleVoiceListen}
                  className={`ml-2 sm:ml-3 p-4 sm:p-5 rounded-2xl shadow-inner border transition-all ${isListening ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-pulse' : 'bg-black/5 text-gray-500 border-white/10 hover:bg-black/10'}`}
                  title={isListening ? "Listening for 'বাঁচাও', 'ডাকাত', 'Help'" : "Enable Voice Trigger"}
                >
                  <Mic className="w-6 h-6" />
                </button>

                </div>
              </div>
            </>
          )}
      </div>
      ) : (
        <div className="w-full bg-[#0a0a0a] rounded-[2rem] p-6 text-white shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-500/30 overflow-hidden relative backdrop-blur-3xl animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Animated Radar Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] aspect-square pointer-events-none opacity-20">
            <div className="absolute inset-0 rounded-full border border-red-500/30 animate-[ping_4s_infinite]"></div>
            <div className="absolute inset-0 rounded-full border border-red-500/20 animate-[ping_4s_infinite_1s]"></div>
            <div className="absolute inset-0 rounded-full border border-red-500/10 animate-[ping_4s_infinite_2s]"></div>
            
            {/* Radar Sweep */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(220,38,38,0.2)_90deg,transparent_90deg)] animate-[spin_3s_linear_infinite]"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Header */}
            <div className="flex justify-center w-full items-center mb-6">
              <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="font-bold tracking-widest text-red-400 text-xs uppercase">Global Broadcast Active</span>
              </div>
            </div>

            <div className="bg-red-500/10 p-4 rounded-full border border-red-500/30 mb-4 animate-bounce">
              <AlertTriangle className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            </div>
            
            <h2 className="text-3xl font-black mb-1 text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">EMERGENCY SOS</h2>
            <p className="text-red-400/80 font-bold text-xs tracking-widest uppercase mb-4">Threat Level: High</p>

            <div className="w-full flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {sosList.map((sos, index) => (
                <div key={sos.user.phone || index} className="bg-white/5 w-full rounded-2xl p-4 border border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col gap-3">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  
                  {/* Victim Header */}
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
                      <User className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Victim Details</h3>
                      <p className="text-white font-black text-lg leading-none mb-1">{sos.user.name}</p>
                      <p className="text-red-300 font-mono text-sm">{sos.user.phone}</p>
                    </div>
                    {sos.user.phone === currentUser?.phone && (
                      <button 
                        onClick={cancelSOS}
                        className="bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors text-red-300 text-xs font-bold uppercase tracking-widest"
                      >
                        Cancel My Alert
                      </button>
                    )}
                  </div>

                  {/* Message */}
                  {sos.message && (
                    <div className="bg-red-600/20 rounded-xl p-3 border border-red-500/40">
                      <p className="text-red-100 font-bold text-sm">"{sos.message}"</p>
                    </div>
                  )}

                  {/* High-Tech Location Display */}
                  <div className="bg-black/40 rounded-xl p-3 border border-red-900/30 shadow-inner">
                    <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-red-500" />
                        <span className="font-bold text-[10px] text-gray-400 tracking-widest">LIVE TRACING</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                      </div>
                    </div>
                    
                    {sos.coordinates ? (
                      <div className="flex justify-between items-center bg-[#111] p-2 rounded-lg border border-white/5">
                        <div className="font-mono text-red-400 text-xs tracking-wider">
                          <div className="flex justify-between w-28"><span className="text-gray-600">LAT</span> <span>{sos.coordinates.lat.toFixed(5)}</span></div>
                          <div className="flex justify-between w-28"><span className="text-gray-600">LNG</span> <span>{sos.coordinates.lng.toFixed(5)}</span></div>
                        </div>
                        <div className="h-6 w-6 border border-red-500/30 rounded-full flex items-center justify-center relative">
                          <div className="w-1 h-1 bg-red-500 rounded-full shadow-[0_0_5px_red]"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-2 bg-[#111] rounded-lg border border-white/5 text-red-500/60 font-mono text-[10px] uppercase tracking-widest">
                        <span className="animate-pulse">Acquiring GPS Signal...</span>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* Silent Phone Override Note */}
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex items-center gap-3">
                 <button onClick={() => {
                  setMuted(!muted);
                  if (audioRef.current) {
                    if (!muted) audioRef.current.pause();
                    else audioRef.current.play();
                  }
                 }} className="bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors border border-white/10">
                  {muted ? <VolumeX className="w-5 h-5 text-gray-500" /> : <Volume2 className="w-5 h-5 text-red-400 animate-pulse" />}
                 </button>
                 <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Siren Override Active</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AIGramPahara;

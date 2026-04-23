import React, { useState } from 'react';
import { ArrowLeft, Flame, Trophy, Target, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { YOUTH_COURSES } from '../data/courses';
import CoursePlayer from '../components/learn/CoursePlayer';
import AITutor from '../components/learn/AITutor';

const YouthLearnPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, updateYouthProgress } = useAuth();
  const [activeTab, setActiveTab] = useState<'course' | 'tutor'>('course');

  const progress = user?.youthProgress || {
    learnProgress: 0,
    earnCompleted: false,
    growUnlocked: false,
    completedLessons: [],
    quizScores: {},
    streakDays: 0,
    lastActive: new Date().toISOString()
  };

  const completedLessons = progress.completedLessons || [];
  
  // Calculate Progress %
  const currentCourse = YOUTH_COURSES[0];
  const totalLessons = currentCourse.modules.flatMap(m => m.lessons).length;
  const rawProgress = Math.round((completedLessons.length / totalLessons) * 100);
  const displayProgress = Math.min(rawProgress, 100);

  const handleLessonComplete = async (lessonId: string, passedQuiz: boolean) => {
    if (!completedLessons.includes(lessonId)) {
      const newArr = [...completedLessons, lessonId];
      const newProg = Math.round((newArr.length / totalLessons) * 100);
      
      await updateYouthProgress({
        completedLessons: newArr,
        learnProgress: newProg
      });
    }
  };

  // Determine Level
  let level = "Beginner";
  if (displayProgress >= 50) level = "Intermediate";
  if (displayProgress >= 100) level = "Advanced";

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="bg-indigo-600 pt-8 pb-12 px-6 rounded-b-[3.5rem] shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-white text-2xl font-black flex items-center gap-2">
                Smart Learning Hub
              </h2>
              <p className="text-indigo-200 mt-1 font-bold uppercase tracking-widest text-[10px]">Learn digitally, earn globally</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 border border-orange-500/30 text-orange-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-inner">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-black text-sm">{progress.streakDays || 1}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
        
        {/* Progress Tracker Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Course Progress</h3>
                <p className="text-2xl font-black text-gray-800">{displayProgress}% <span className="text-sm text-gray-400 font-bold ml-1">Completed</span></p>
              </div>
              <div className="text-right">
                 <span className="bg-indigo-100 text-indigo-700 font-black text-[10px] px-2 py-1 rounded-md uppercase tracking-wider">{level}</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${displayProgress}%` }}></div>
            </div>
          </div>
          
          <div className="flex gap-4 shrink-0 w-full md:w-auto">
             <div className="bg-blue-50 p-4 rounded-2xl flex-1 flex flex-col items-center justify-center border border-blue-100">
               <Target className="w-6 h-6 text-blue-500 mb-1" />
               <span className="text-xl font-black text-blue-700">{completedLessons.length}/{totalLessons}</span>
               <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Lessons</span>
             </div>
             <div className="bg-amber-50 p-4 rounded-2xl flex-1 flex flex-col items-center justify-center border border-amber-100">
               <Trophy className="w-6 h-6 text-amber-500 mb-1" />
               <span className="text-xl font-black text-amber-700">{Object.keys(progress.quizScores || {}).length}</span>
               <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Quizzes</span>
             </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('course')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${activeTab === 'course' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Digital Course
          </button>
          <button 
            onClick={() => setActiveTab('tutor')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'tutor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare className="w-4 h-4" /> AI Tutor
          </button>
        </div>

        {/* Dynamic View */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'course' ? (
            <CoursePlayer 
              course={currentCourse} 
              completedLessonIds={completedLessons}
              onLessonComplete={handleLessonComplete}
            />
          ) : (
            <AITutor />
          )}
        </div>

      </div>
    </div>
  );
};

export default YouthLearnPage;

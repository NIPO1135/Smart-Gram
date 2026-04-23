import React, { useState } from 'react';
import { Course, Lesson } from '../../data/courses';
import { Lock, CheckCircle2, PlayCircle, ChevronRight } from 'lucide-react';
import QuizSystem from './QuizSystem';

interface CoursePlayerProps {
  course: Course;
  completedLessonIds: string[];
  onLessonComplete: (lessonId: string, passedQuiz: boolean) => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, completedLessonIds, onLessonComplete }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson>(course.modules[0].lessons[0]);
  const [showQuiz, setShowQuiz] = useState(false);

  // Flatten logic to find if a lesson is unlocked
  // A lesson is unlocked if it's the very first lesson, OR if the previous lesson in the flattened list is in completedLessonIds.
  const flatLessons = course.modules.flatMap(m => m.lessons);
  const getDependency = (lessonId: string) => {
    const idx = flatLessons.findIndex(l => l.id === lessonId);
    if (idx <= 0) return null;
    return flatLessons[idx - 1].id;
  };

  const isUnlocked = (lessonId: string) => {
    const dep = getDependency(lessonId);
    if (!dep) return true; // first lesson
    return completedLessonIds.includes(dep);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (isUnlocked(lesson.id)) {
      setActiveLesson(lesson);
      setShowQuiz(false);
    }
  };

  const handleCompleteClick = () => {
    if (activeLesson.quiz && activeLesson.quiz.length > 0) {
      setShowQuiz(true);
    } else {
      onLessonComplete(activeLesson.id, true);
      // Auto move to next unlocked lesson
      const activeIdx = flatLessons.findIndex(l => l.id === activeLesson.id);
      if (activeIdx < flatLessons.length - 1) {
        setActiveLesson(flatLessons[activeIdx + 1]);
      }
    }
  };

  const handleQuizComplete = (score: number) => {
    // Basic pass logic > 0. Usually >50%.
    const total = activeLesson.quiz?.length || 1;
    const passed = score >= total / 2;
    if (passed) {
      onLessonComplete(activeLesson.id, true);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-white rounded-[2rem] p-4 md:p-6 shadow-xl border border-gray-100">
      
      {/* Sidebar - Course Outline */}
      <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
        <h3 className="font-black text-xl text-gray-800">{course.title}</h3>
        <div className="space-y-4">
          {course.modules.map(module => (
            <div key={module.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <h4 className="font-bold text-sm text-gray-600 uppercase tracking-widest mb-3">{module.title}</h4>
              <div className="space-y-2">
                {module.lessons.map(lesson => {
                  const unlocked = isUnlocked(lesson.id);
                  const completed = completedLessonIds.includes(lesson.id);
                  const isActive = activeLesson.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      disabled={!unlocked}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between text-sm transition-all ${
                        isActive ? 'bg-indigo-600 text-white shadow-md' :
                        !unlocked ? 'bg-white opacity-50 text-gray-400' :
                        'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {completed ? (
                          <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-green-500'}`} />
                        ) : unlocked ? (
                          <PlayCircle className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-indigo-500'}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="font-bold truncate">{lesson.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-2/3 flex flex-col bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative">
        {showQuiz ? (
          <div className="p-4 md:p-8 flex items-center justify-center min-h-[400px]">
             {activeLesson.quiz && (
               <QuizSystem questions={activeLesson.quiz} onComplete={handleQuizComplete} />
             )}
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Visual Header / Placeholder Video */}
            <div className="h-48 md:h-64 bg-slate-800 relative flex items-center justify-center shrink-0">
              <PlayCircle className="w-16 h-16 text-white opacity-50" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/50 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-md">Lesson {flatLessons.findIndex(l=>l.id===activeLesson.id)+1}</span>
              </div>
            </div>

            {/* Content body */}
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h2 className="text-2xl font-black text-gray-800 mb-4">{activeLesson.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-8 flex-1 text-sm md:text-base">
                {activeLesson.textContext}
              </p>

              {/* Action */}
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                {completedLessonIds.includes(activeLesson.id) ? (
                  <div className="bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> সমাপ্ত হয়েছে
                  </div>
                ) : (
                  <button 
                    onClick={handleCompleteClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-sm flex items-center gap-2 transition-all shadow-lg hover:-translate-y-0.5"
                  >
                    লেসন সম্পন্ন করুন <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CoursePlayer;

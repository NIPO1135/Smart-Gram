import React, { useState } from 'react';
import { QuizQuestion } from '../../data/courses';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

interface QuizSystemProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const QuizSystem: React.FC<QuizSystemProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOption === currentQ.correctAnswer ? 1 : 0));
    }
  };

  if (showResult) {
    const finalScore = score;
    const isPassed = finalScore >= questions.length / 2;
    return (
      <div className="bg-white p-6 rounded-[2rem] text-center border-2 border-indigo-100 shadow-xl w-full max-w-md mx-auto">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          <Award className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">{isPassed ? 'অসাধারণ!' : 'আবার চেষ্টা করুন'}</h3>
        <p className="text-gray-500 font-bold mb-6">আপনি {questions.length} টির মধ্যে {finalScore} টি সঠিক উত্তর দিয়েছেন।</p>
        <button 
          onClick={() => {}} // Could reset or close
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-wider"
        >
          কন্টিনিউ করুন
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden w-full max-w-xl mx-auto flex flex-col">
      <div className="bg-indigo-600 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-[-20%] w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <h3 className="text-white text-lg font-black leading-snug relative z-10">
          {currentQ.question}
        </h3>
        <div className="mt-4 flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= currentIndex ? 'bg-white' : 'bg-indigo-400'}`} />
          ))}
        </div>
      </div>
      
      <div className="p-6 space-y-3 bg-gray-50/50">
        {currentQ.options.map((opt, idx) => {
          let bgColor = 'bg-white hover:bg-gray-50 border-gray-200';
          let textColor = 'text-gray-700';
          let icon = null;

          if (isAnswered) {
            if (idx === currentQ.correctAnswer) {
              bgColor = 'bg-green-50 border-green-500';
              textColor = 'text-green-700 font-bold';
              icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
            } else if (idx === selectedOption) {
              bgColor = 'bg-red-50 border-red-500';
              textColor = 'text-red-700 font-bold';
              icon = <XCircle className="w-5 h-5 text-red-500" />;
            } else {
              bgColor = 'bg-white opacity-50 border-gray-200';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between shadow-sm ${bgColor}`}
            >
              <span className={textColor}>{opt}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="p-6 bg-white border-t border-gray-100 animate-in slide-in-from-bottom-2">
          <button 
            onClick={handleNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-wider text-sm transition-colors"
          >
            পরবর্তী প্রশ্ন
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSystem;

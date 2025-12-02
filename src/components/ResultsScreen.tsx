import { Trophy, Clock, Target, RotateCcw, Home } from 'lucide-react';
import { calculateAccuracy, formatTime } from '../utils/gameUtils';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export default function ResultsScreen({ 
  score, 
  totalQuestions, 
  timeSpent, 
  onPlayAgain, 
  onBackToMenu 
}: ResultsScreenProps) {
  const accuracy = calculateAccuracy(score, totalQuestions);
  const formattedTime = formatTime(timeSpent);

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { 
      message: "Outstanding!", 
      emoji: "🌟",
      color: "text-accent-600", 
      bg: "bg-accent-50",
      badge: "Excellent"
    };
    if (accuracy >= 80) return { 
      message: "Great work!", 
      emoji: "🎉",
      color: "text-primary-600", 
      bg: "bg-primary-50",
      badge: "Very Good"
    };
    if (accuracy >= 70) return { 
      message: "Good job!", 
      emoji: "👍",
      color: "text-blue-600", 
      bg: "bg-blue-50",
      badge: "Good"
    };
    if (accuracy >= 60) return { 
      message: "Not bad!", 
      emoji: "📚",
      color: "text-purple-600", 
      bg: "bg-purple-50",
      badge: "Fair"
    };
    return { 
      message: "Keep practicing!", 
      emoji: "💪",
      color: "text-gray-600", 
      bg: "bg-gray-50",
      badge: "Practice More"
    };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      <div className="card mb-6">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-5 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Quiz Complete!</h2>
          <div className={`inline-block px-5 py-2 rounded-full ${performance.bg} ${performance.color} font-semibold text-lg`}>
            <span className="mr-2">{performance.emoji}</span>
            {performance.message}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl mb-8 shadow-inner">
          <div className="text-6xl font-bold text-primary-600 mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-2xl font-semibold text-gray-700">
            {accuracy}% Accuracy
          </div>
          <div className="mt-3">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white text-primary-700 text-sm font-medium shadow-sm">
              {performance.badge}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-5 rounded-xl border border-green-200">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{score}</div>
            <div className="text-sm text-green-600 font-medium">Correct</div>
          </div>
          
          <div className="bg-red-50 p-5 rounded-xl border border-red-200">
            <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-800">{totalQuestions - score}</div>
            <div className="text-sm text-red-600 font-medium">Incorrect</div>
          </div>
          
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{formattedTime}</div>
            <div className="text-sm text-blue-600 font-medium">Time</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={onPlayAgain}
            className="btn-primary flex items-center space-x-2 justify-center"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Play Again</span>
          </button>
          
          <button
            onClick={onBackToMenu}
            className="btn-secondary flex items-center space-x-2 justify-center"
          >
            <Home className="h-4 w-4" />
            <span>Back to Menu</span>
          </button>
        </div>
      </div>

      <div className="bg-primary-50 rounded-xl p-5 text-sm text-gray-700">
        {accuracy < 70 ? (
          <p>💡 Review the words you missed and try again to improve your score!</p>
        ) : (
          <p>🎯 Great work! Challenge yourself with more vocabulary or try a longer quiz.</p>
        )}
      </div>
    </div>
  );
} 
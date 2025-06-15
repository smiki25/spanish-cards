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
    if (accuracy >= 90) return { message: "Outstanding! 🌟", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (accuracy >= 80) return { message: "Excellent work! 🎉", color: "text-green-600", bg: "bg-green-50" };
    if (accuracy >= 70) return { message: "Good job! 👍", color: "text-blue-600", bg: "bg-blue-50" };
    if (accuracy >= 60) return { message: "Not bad! 📚", color: "text-purple-600", bg: "bg-purple-50" };
    return { message: "Keep practicing! 💪", color: "text-orange-600", bg: "bg-orange-50" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      <div className="card mb-6">
        <div className="mb-6">
          <div className="bg-primary-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <div className={`inline-block px-4 py-2 rounded-lg ${performance.bg} ${performance.color} font-semibold text-lg`}>
            {performance.message}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-lg mb-6">
          <div className="text-6xl font-bold text-primary-600 mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-2xl font-semibold text-gray-700">
            {accuracy}% Accuracy
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{score}</div>
            <div className="text-sm text-green-600">Correct Answers</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-800">{totalQuestions - score}</div>
            <div className="text-sm text-red-600">Incorrect Answers</div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">{formattedTime}</div>
            <div className="text-sm text-blue-600">Time Spent</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

      <div className="text-sm text-gray-600">
        {accuracy < 70 ? (
          <p>💡 Try reviewing the words you missed and take the quiz again to improve your score!</p>
        ) : (
          <p>🎯 Great work! Challenge yourself with more vocabulary words or try a longer quiz.</p>
        )}
      </div>
    </div>
  );
} 
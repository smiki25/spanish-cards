import { GameState } from '../types';
import { CheckCircle, XCircle, ArrowRight, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { speakSpanishText, isSpeechSynthesisSupported, isTTSAvailable } from '../utils/gameUtils';

interface GameScreenProps {
  gameState: GameState;
  onAnswer: (answer: string) => void;
  onNext: () => void;
}

const GameScreen = ({ gameState, onAnswer, onNext }: GameScreenProps) => {
  const { currentQuestion, score, totalQuestions, currentQuestionIndex, isAnswered, selectedAnswer } = gameState;
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported] = useState(isSpeechSynthesisSupported());
  const [ttsAvailable] = useState(isTTSAvailable());

  useEffect(() => {
    if (speechSupported) {
      window.speechSynthesis.getVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }

    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  const playSpanishAudio = async () => {
    if (!currentQuestion || !speechSupported || !ttsAvailable) return;
    
    await speakSpanishText(currentQuestion.word.spanish, {
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };



  if (!currentQuestion) return null;

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <>
      <div className="hidden md:block">
        <div className="card max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-sm font-medium text-gray-500 mb-4">Translate this Spanish word:</h2>
            <div className="bg-blue-50 rounded-xl p-8 mb-6">
              <h1 className="text-5xl font-bold text-blue-800 mb-4">
                {currentQuestion.word.spanish}
              </h1>
              {currentQuestion.word.category && !gameState.hardMode && (
                <span className="inline-block bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {currentQuestion.word.category}
                </span>
              )}
            </div>

            {speechSupported && (
              <button
                onClick={playSpanishAudio}
                className={`btn-secondary ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isPlaying}
              >
                <div className="flex items-center gap-2">
                  <Volume2 className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                  {isPlaying ? 'Playing...' : 'Listen'}
                </div>
              </button>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
              Choose the correct English translation:
            </h3>
            
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium";
                
                if (!isAnswered) {
                  buttonClass += " border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                } else {
                  if (option === currentQuestion.correctAnswer) {
                    buttonClass += " border-green-500 bg-green-50 text-green-800";
                  } else if (option === selectedAnswer) {
                    buttonClass += " border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += " border-gray-200 bg-gray-50 text-gray-500";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => !isAnswered && onAnswer(option)}
                    className={buttonClass}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{option}</span>
                      {isAnswered && option === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                      {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="text-center">
                <button
                  onClick={onNext}
                  className="btn-primary py-4 px-8 text-lg"
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {currentQuestionIndex + 1 === totalQuestions 
                        ? 'View Results' 
                        : 'Next Question'
                      }
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden min-h-screen flex flex-col p-4">
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Score: {score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 text-center">
            <p className="text-gray-500 text-sm mb-3">Translate this Spanish word:</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-4">
              {currentQuestion.word.spanish}
            </h1>
            
            {currentQuestion.word.category && !gameState.hardMode && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-4">
                {currentQuestion.word.category}
              </span>
            )}

            {speechSupported && (
              <div className="mt-4">
                <button
                  onClick={playSpanishAudio}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isPlaying 
                      ? 'bg-blue-200 text-blue-700 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                  }`}
                  disabled={isPlaying}
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                    {isPlaying ? 'Playing...' : 'Listen'}
                  </div>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 font-medium touch-manipulation";
              
              if (!isAnswered) {
                buttonClass += " border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100";
              } else {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass += " border-green-500 bg-green-50 text-green-800";
                } else if (option === selectedAnswer) {
                  buttonClass += " border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += " border-gray-200 bg-gray-50 text-gray-500";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => !isAnswered && onAnswer(option)}
                  className={buttonClass}
                  disabled={isAnswered}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg">{option}</span>
                    {isAnswered && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    )}
                    {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <button
              onClick={onNext}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">
                  {currentQuestionIndex + 1 === totalQuestions 
                    ? 'View Results' 
                    : 'Next Question'
                  }
                </span>
                <ArrowRight className="h-5 w-5" />
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default GameScreen; 
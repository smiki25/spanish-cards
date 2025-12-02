import { useState } from 'react';
import { Play, Volume2 } from 'lucide-react';
import { 
  speakSpanishText, 
  isSpeechSynthesisSupported, 
  isTTSAvailable,
  hasUserApiKey
} from '../utils/gameUtils';

interface WelcomeScreenProps {
  vocabularyCount: number;
  onStartGame: (questionCount: number, hardMode?: boolean) => void;
}

const WelcomeScreen = ({ vocabularyCount, onStartGame }: WelcomeScreenProps) => {
  const [selectedCount, setSelectedCount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const speechSupported = isSpeechSynthesisSupported();
  const ttsAvailable = isTTSAvailable();
  const userHasApiKey = hasUserApiKey();

  const questionCounts = [5, 10, 15, 20, Math.min(vocabularyCount, 50)];

  const testVoice = async () => {
    if (!speechSupported) return;
    
    const testText = '¡Hola! Bienvenido al quiz de español.';
    
    await speakSpanishText(testText, {
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };



  return (
    <>
      <div className="hidden md:block">
        <div className="card max-w-2xl mx-auto text-center animate-fade-in">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Spanish Vocabulary Quiz
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Test your knowledge and expand your vocabulary
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
              <span className="text-2xl">🎸</span>
              <span className="text-sm font-medium text-primary-700">¡Vamos!</span>
            </div>
          </div>

          {speechSupported && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Volume2 className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Audio Pronunciation
                </h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Test Spanish pronunciation feature
                {userHasApiKey && <span className="text-xs block mt-1 text-primary-600">✨ Enhanced with AI</span>}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={testVoice}
                  className={`btn-secondary ${
                    isPlaying ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isPlaying}
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                    {isPlaying ? 'Playing...' : 'Test Audio'}
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="bg-accent-50 rounded-xl p-6 mb-8">
            <h3 className="text-base font-semibold text-gray-700 mb-2">
              Vocabulary Available
            </h3>
            <p className="text-5xl font-bold text-primary-600 mb-2">{vocabularyCount}</p>
            <p className="text-sm text-gray-600">words ready to practice</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Choose number of questions:
            </h3>
            <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedCount(count)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 font-semibold text-lg ${
                    selectedCount === count
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-primary-50 rounded-xl p-4 max-w-md mx-auto">
              <label className="flex items-center justify-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hardMode}
                  onChange={(e) => setHardMode(e.target.checked)}
                  className="w-5 h-5 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <div className="text-center">
                  <span className="text-primary-700 font-semibold">Hard Mode</span>
                  <p className="text-gray-600 text-sm mt-1">Hide word categories for extra challenge</p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={() => onStartGame(selectedCount, hardMode)}
            className="btn-primary py-4 px-8 text-lg mb-6"
          >
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              <span>Start Quiz</span>
            </div>
          </button>

          <p className="text-sm text-gray-500">
            💡 {speechSupported && ttsAvailable ? 'Use headphones for the best experience' : 'Upload your own vocabulary using the button above'}
          </p>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Spanish Quiz
              </h1>
              <p className="text-base text-gray-600 mb-3">
                Test your vocabulary knowledge
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full">
                <span className="text-xl">🎸</span>
                <span className="text-xs font-medium text-primary-700">¡Vamos!</span>
              </div>
            </div>

            {speechSupported && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Volume2 className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    Audio Pronunciation
                    {userHasApiKey && <span className="text-xs block text-primary-600">✨ AI Enhanced</span>}
                  </span>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={testVoice}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isPlaying 
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                    disabled={isPlaying}
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                      {isPlaying ? 'Playing...' : 'Test'}
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-accent-50 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Vocabulary Available</p>
              <p className="text-4xl font-bold text-primary-600">
                {vocabularyCount}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-3 text-center">
                Choose number of questions:
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {questionCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedCount(count)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 font-semibold text-lg ${
                      selectedCount === count
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-primary-50 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hardMode}
                    onChange={(e) => setHardMode(e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-primary-700 font-semibold text-sm">Hard Mode</span>
                    <p className="text-gray-600 text-xs mt-1">Hide categories</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={() => onStartGame(selectedCount, hardMode)}
              className="w-full btn-primary py-4 px-6"
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                <span className="text-lg">Start Quiz</span>
              </div>
            </button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                💡 {speechSupported && ttsAvailable ? 'Use headphones for best experience' : 'Upload your own vocabulary'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen; 
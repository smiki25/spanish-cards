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
        <div className="card max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Spanish Vocabulary Quiz
            </h1>
            <p className="text-gray-600 text-lg">
              Test your Spanish vocabulary knowledge with our interactive quiz
            </p>
          </div>

          {speechSupported && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Volume2 className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-800">
                  Audio Pronunciation
                </h3>
              </div>
              <p className="text-blue-700 mb-4">
                Test the Spanish pronunciation feature
                {userHasApiKey && <span className="text-xs block mt-1">✨ Enhanced with ElevenLabs AI</span>}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={testVoice}
                  className={`btn-primary ${
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

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Vocabulary Available
            </h3>
            <p className="text-4xl font-bold text-blue-600 mb-2">{vocabularyCount}</p>
            <p className="text-gray-600">words ready to practice</p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Choose number of questions:
            </h3>
            <div className="grid grid-cols-5 gap-4 max-w-lg mx-auto">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedCount(count)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 font-medium text-lg ${
                    selectedCount === count
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-orange-50 rounded-lg p-4 max-w-md mx-auto">
              <label className="flex items-center justify-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hardMode}
                  onChange={(e) => setHardMode(e.target.checked)}
                  className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <div className="text-center">
                  <span className="text-orange-800 font-semibold">🔥 Hard Mode</span>
                  <p className="text-orange-700 text-sm mt-1">Hide word categories for extra challenge</p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={() => onStartGame(selectedCount, hardMode)}
            className="btn-primary py-4 px-8 text-lg mb-6"
          >
            <div className="flex items-center gap-3">
              <Play className="h-6 w-6" />
              <span>Start Quiz</span>
            </div>
          </button>

          <p className="text-gray-500 text-sm">
            💡 {speechSupported && ttsAvailable ? 'Use headphones for the best experience' : 'Upload your own vocabulary using the button above'}
          </p>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                Spanish Quiz
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Test your Spanish vocabulary knowledge
              </p>
            </div>

            {speechSupported && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <Volume2 className="h-5 w-5 text-blue-600" />
                                      <span className="text-blue-800 font-medium text-sm">
                      Audio Pronunciation
                      {userHasApiKey && <span className="text-xs block">✨ ElevenLabs AI</span>}
                    </span>
                </div>
                <div className="flex justify-center mt-3">
                  <button
                    onClick={testVoice}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isPlaying 
                        ? 'bg-blue-200 text-blue-700 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
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

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-lg">{vocabularyCount}</span> words available
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Choose number of questions:
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {questionCounts.map((count) => (
                  <button
                    key={count}
                    onClick={() => setSelectedCount(count)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 font-medium text-lg ${
                      selectedCount === count
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-orange-50 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hardMode}
                    onChange={(e) => setHardMode(e.target.checked)}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-orange-800 font-semibold text-sm">🔥 Hard Mode</span>
                    <p className="text-orange-700 text-xs mt-1">Hide categories for extra challenge</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={() => onStartGame(selectedCount, hardMode)}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center gap-3">
                <Play className="h-5 w-5" />
                <span className="text-lg">Start Quiz</span>
              </div>
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs sm:text-sm">
                💡 {speechSupported && ttsAvailable ? 'Use headphones for the best experience' : 'Upload your own vocabulary using the button above'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen; 
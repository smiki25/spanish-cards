import { useState, useEffect } from 'react';
import { VocabularyWord, GameState, QuizQuestion } from './types';
import { generateQuizQuestions, validateVocabularyData } from './utils/gameUtils';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import FileUpload from './components/FileUpload';

function App() {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [isLoadingVocabulary, setIsLoadingVocabulary] = useState(true);
  const [vocabularyError, setVocabularyError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    score: 0,
    totalQuestions: 0,
    currentQuestionIndex: 0,
    isAnswered: false,
    selectedAnswer: null,
    isCorrect: null,
    gameStarted: false,
    gameCompleted: false,
    hardMode: false,
  });
  const [startTime, setStartTime] = useState<number>(0);
  const [showFileUpload, setShowFileUpload] = useState(false);

  useEffect(() => {
    const loadVocabulary = async () => {
      try {
        setIsLoadingVocabulary(true);
        setVocabularyError(null);
        
        const response = await fetch('/sample-vocabulary.json');
        if (!response.ok) {
          throw new Error(`Failed to load vocabulary: ${response.status}`);
        }
        
        const jsonData = await response.json();
        const validatedData = validateVocabularyData(jsonData);
        setVocabulary(validatedData);
      } catch (error) {
        console.error('Error loading vocabulary:', error);
        setVocabularyError(error instanceof Error ? error.message : 'Failed to load vocabulary');
        setVocabulary([
          {
            id: '1',
            spanish: 'hola',
            english: 'hello',
            category: 'greetings',
            difficulty: 'easy'
          },
          {
            id: '2',
            spanish: 'adiós',
            english: 'goodbye',
            category: 'greetings',
            difficulty: 'easy'
          }
        ]);
      } finally {
        setIsLoadingVocabulary(false);
      }
    };

    loadVocabulary();
  }, []);

  const startGame = (questionCount: number = 10, hardMode: boolean = false) => {
    const quizQuestions = generateQuizQuestions(vocabulary, questionCount);
    setQuestions(quizQuestions);
    setGameState({
      currentQuestion: quizQuestions[0] || null,
      score: 0,
      totalQuestions: quizQuestions.length,
      currentQuestionIndex: 0,
      isAnswered: false,
      selectedAnswer: null,
      isCorrect: null,
      gameStarted: true,
      gameCompleted: false,
      hardMode: hardMode,
    });
    setStartTime(Date.now());
  };

  const handleAnswer = (selectedAnswer: string) => {
    if (gameState.isAnswered || !gameState.currentQuestion) return;

    const isCorrect = selectedAnswer === gameState.currentQuestion.correctAnswer;
    setGameState(prev => ({
      ...prev,
      isAnswered: true,
      selectedAnswer,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const nextQuestion = () => {
    const nextIndex = gameState.currentQuestionIndex + 1;
    
    if (nextIndex >= gameState.totalQuestions) {
      setGameState(prev => ({
        ...prev,
        gameCompleted: true,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: questions[nextIndex],
        currentQuestionIndex: nextIndex,
        isAnswered: false,
        selectedAnswer: null,
        isCorrect: null,
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentQuestion: null,
      score: 0,
      totalQuestions: 0,
      currentQuestionIndex: 0,
      isAnswered: false,
      selectedAnswer: null,
      isCorrect: null,
      gameStarted: false,
      gameCompleted: false,
      hardMode: false,
    });
    setQuestions([]);
    setStartTime(0);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const validatedData = validateVocabularyData(jsonData);
        setVocabulary(validatedData);
        setVocabularyError(null);
        setShowFileUpload(false);
        alert(`Successfully loaded ${validatedData.length} vocabulary words!`);
      } catch (error) {
        alert(`Error loading file: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
      }
    };
    reader.readAsText(file);
  };

  const getTimeSpent = () => {
    return startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  };

  if (isLoadingVocabulary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onUploadClick={() => setShowFileUpload(true)}
        onResetClick={resetGame}
        gameStarted={gameState.gameStarted}
      />
      
      <main className="container mx-auto px-4 py-8">
        {vocabularyError && (
          <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 text-accent-800">
              <span className="font-semibold">⚠️ Vocabulary Loading Issue:</span>
            </div>
            <p className="text-accent-700 mt-1">{vocabularyError}</p>
            <p className="text-accent-600 text-sm mt-2">Using fallback vocabulary. You can upload your own JSON file to add more words.</p>
          </div>
        )}

        {showFileUpload && (
          <FileUpload
            onFileUpload={handleFileUpload}
            onClose={() => setShowFileUpload(false)}
          />
        )}

        {!gameState.gameStarted && !gameState.gameCompleted && (
          <WelcomeScreen
            vocabularyCount={vocabulary.length}
            onStartGame={startGame}
          />
        )}

        {gameState.gameStarted && !gameState.gameCompleted && (
          <GameScreen
            gameState={gameState}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
          />
        )}

        {gameState.gameCompleted && (
          <ResultsScreen
            score={gameState.score}
            totalQuestions={gameState.totalQuestions}
            timeSpent={getTimeSpent()}
            onPlayAgain={() => startGame(gameState.totalQuestions, gameState.hardMode)}
            onBackToMenu={resetGame}
          />
        )}
      </main>
    </div>
  );
}

export default App; 
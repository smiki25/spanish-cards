import { VocabularyWord, QuizQuestion } from '../types';

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateIncorrectOptions(
  correctWord: VocabularyWord,
  allWords: VocabularyWord[],
  count: number = 3
): string[] {
  const incorrectWords = allWords
    .filter(word => word.id !== correctWord.id && word.english !== correctWord.english)
    .map(word => word.english);
  
  return shuffleArray(incorrectWords).slice(0, count);
}

export function createQuizQuestion(
  word: VocabularyWord,
  allWords: VocabularyWord[]
): QuizQuestion {
  const incorrectOptions = generateIncorrectOptions(word, allWords, 3);
  const allOptions = [word.english, ...incorrectOptions];
  const shuffledOptions = shuffleArray(allOptions);

  return {
    word,
    options: shuffledOptions,
    correctAnswer: word.english
  };
}

export function generateQuizQuestions(
  words: VocabularyWord[],
  questionCount?: number
): QuizQuestion[] {
  const shuffledWords = shuffleArray(words);
  const selectedWords = questionCount 
    ? shuffledWords.slice(0, Math.min(questionCount, words.length))
    : shuffledWords;

  return selectedWords.map(word => createQuizQuestion(word, words));
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const TTS_CONFIG = {
  elevenlabs: {
    apiUrl: 'https://api.elevenlabs.io/v1/text-to-speech',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // High-quality multilingual voice
  }
};

export const getAvailableSpanishVoices = (): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) return [];
  
  const voices = window.speechSynthesis.getVoices();
  return voices.filter(voice => {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();
    
    if (lang.startsWith('es-')) return true;
    
    const spanishVoiceNames = [
      'spanish', 'español', 'espanol',
      'diego', 'monica', 'jorge', 'paloma', 'carlos', 'lucia',
      'miguel', 'esperanza', 'enrique', 'marisol', 'alejandro',
      'carmen', 'fernando', 'isabella', 'ricardo', 'sofia',
      'antonio', 'maria', 'juan', 'ana', 'pablo', 'elena',
      'google español', 'microsoft helena', 'microsoft pablo',
      'sabina', 'tessa', 'alvaro', 'elvira', 'dalia',
      'neural', 'premium'
    ];
    
    return spanishVoiceNames.some(spanishName => name.includes(spanishName));
  });
};

const getElevenLabsApiKey = (): string | null => {
  return import.meta.env.VITE_ELEVENLABS_API_KEY || null;
};

export const hasUserApiKey = (): boolean => {
  return !!getElevenLabsApiKey();
};

const speakWithElevenLabs = async (
  text: string,
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  } = {}
): Promise<boolean> => {
  const apiKey = getElevenLabsApiKey();
  if (!apiKey) {
    return false;
  }

  try {
    options.onStart?.();

    const response = await fetch(`${TTS_CONFIG.elevenlabs.apiUrl}/${TTS_CONFIG.elevenlabs.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      options.onEnd?.();
    };
    
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      options.onError?.();
    };

    await audio.play();
    return true;

  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    options.onError?.();
    return false;
  }
};

const speakWithWebSpeech = (
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceName?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  } = {}
): void => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    options.onError?.();
    return;
  }

  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.lang = 'es-ES';
  utterance.rate = options.rate ?? 0.7;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;
  
  let selectedVoice: SpeechSynthesisVoice | null = null;
  
  if (options.voiceName) {
    const voices = getAvailableSpanishVoices();
    selectedVoice = voices.find(voice => voice.name === options.voiceName) || null;
  }
  
  if (!selectedVoice) {
    selectedVoice = getBestSpanishVoice();
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang || 'es-ES';
  }
  
  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = options.onError;
  
  window.speechSynthesis.speak(utterance);
};

const speakWithGoogleTTS = async (
  text: string,
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  } = {}
): Promise<boolean> => {
  try {
    options.onStart?.();

    const encodedText = encodeURIComponent(text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodedText}&tk=1`;
    
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    
    audio.onended = () => {
      options.onEnd?.();
    };
    
    audio.onerror = () => {
      options.onError?.();
    };

    audio.oncanplaythrough = () => {
      audio.play().catch(() => {
        options.onError?.();
      });
    };

    audio.src = audioUrl;
    return true;

  } catch (error) {
    console.error('Google TTS error:', error);
    options.onError?.();
    return false;
  }
};

export const speakSpanishText = async (
  text: string, 
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceName?: string;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  } = {}
): Promise<void> => {
  const apiKey = getElevenLabsApiKey();
  if (apiKey) {
    await speakWithElevenLabs(text, {
      onStart: options.onStart,
      onEnd: options.onEnd,
      onError: () => {
        speakWithGoogleTTS(text, {
          onStart: options.onStart,
          onEnd: options.onEnd,
          onError: () => {
            speakWithWebSpeech(text, options);
          }
        });
      }
    });
    return;
  }
  
  await speakWithGoogleTTS(text, {
    onStart: options.onStart,
    onEnd: options.onEnd,
    onError: () => {
      speakWithWebSpeech(text, options);
    }
  });
};

export const isTTSAvailable = (): boolean => {
  return !!getElevenLabsApiKey() || true;
};

export const getBestSpanishVoice = (): SpeechSynthesisVoice | null => {
  const spanishVoices = getAvailableSpanishVoices();
  
  if (spanishVoices.length === 0) return null;
  
  const preferredVoiceName = localStorage.getItem('spanish-cards-preferred-voice');
  if (preferredVoiceName) {
    const preferredVoice = spanishVoices.find(voice => voice.name === preferredVoiceName);
    if (preferredVoice) {
      return preferredVoice;
    }
  }
  
  const voicePriorities = [
    { pattern: /es-es.*neural/i, priority: 15 },
    { pattern: /es-mx.*neural/i, priority: 14 },
    { pattern: /es-es/i, priority: 12 },
    { pattern: /es-mx/i, priority: 11 },
    { pattern: /es-ar/i, priority: 10 },
    { pattern: /es-co/i, priority: 9 },
    { pattern: /es-cl/i, priority: 8 },
    { pattern: /es-pe/i, priority: 7 },
    { pattern: /alvaro|elvira/i, priority: 13 },
    { pattern: /diego|monica|jorge|paloma/i, priority: 12 },
    { pattern: /carlos|lucia|miguel|esperanza/i, priority: 11 },
    { pattern: /google.*español/i, priority: 10 },
    { pattern: /microsoft.*helena|microsoft.*pablo/i, priority: 9 },
    { pattern: /sabina|tessa|dalia/i, priority: 8 },
    { pattern: /neural/i, priority: 5 },
    { pattern: /premium|enhanced|natural/i, priority: 4 },
    { pattern: /español|espanol/i, priority: 6 },
    { pattern: /spanish/i, priority: 5 },
    { pattern: /^es-/i, priority: 3 },
  ];
  
  const scoredVoices = spanishVoices.map(voice => {
    let score = 0;
    const searchText = `${voice.lang} ${voice.name}`.toLowerCase();
    
    for (const { pattern, priority } of voicePriorities) {
      if (pattern.test(searchText)) {
        score = Math.max(score, priority);
      }
    }
    
    if (/female|mujer|monica|lucia|paloma|helena|sabina|tessa|esperanza|marisol|isabella|sofia|carmen|maria|ana|elena|elvira|dalia/i.test(voice.name)) {
      score += 2;
    }
    
    return { voice, score };
  });
  
  scoredVoices.sort((a, b) => b.score - a.score);
  
  return scoredVoices[0]?.voice || null;
};

export const setPreferredSpanishVoice = (voiceName: string): void => {
  localStorage.setItem('spanish-cards-preferred-voice', voiceName);
};

export const getPreferredSpanishVoice = (): string | null => {
  return localStorage.getItem('spanish-cards-preferred-voice');
};

export const isSpeechSynthesisSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

export function validateVocabularyData(data: any): VocabularyWord[] {
  if (!Array.isArray(data)) {
    throw new Error('Vocabulary data must be an array');
  }

  return data.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid vocabulary item at index ${index}`);
    }

    const { id, spanish, english, category, difficulty } = item;

    if (!id || typeof id !== 'string') {
      throw new Error(`Invalid or missing id at index ${index}`);
    }

    if (!spanish || typeof spanish !== 'string') {
      throw new Error(`Invalid or missing spanish word at index ${index}`);
    }

    if (!english || typeof english !== 'string') {
      throw new Error(`Invalid or missing english translation at index ${index}`);
    }

    if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
      throw new Error(`Invalid difficulty level at index ${index}. Must be 'easy', 'medium', or 'hard'`);
    }

    return {
      id,
      spanish: spanish.trim(),
      english: english.trim(),
      category: category?.trim(),
      difficulty: difficulty as 'easy' | 'medium' | 'hard' | undefined
    };
  });
} 
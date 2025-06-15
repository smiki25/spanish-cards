# Spanish Cards - Learn Spanish Vocabulary

A modern, interactive React application for learning Spanish vocabulary through engaging multiple-choice quizzes.

## Features

- 🎯 **Interactive Quizzes**: Multiple-choice questions with 4 options each
- 📊 **Score Tracking**: Real-time scoring and detailed results
- ⏱️ **Time Tracking**: Monitor how long you spend on each quiz
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Clean, beautiful interface built with Tailwind CSS
- 📁 **Custom Vocabulary**: Upload your own JSON vocabulary files
- 🔄 **Instant Feedback**: Immediate feedback on correct/incorrect answers
- 📈 **Progress Tracking**: Detailed statistics and performance metrics
- 🔊 **Professional Spanish Pronunciation**: ElevenLabs AI voices for authentic pronunciation
- 📱 **Mobile-First Design**: Fully responsive and touch-optimized interface

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

## Usage

### Starting a Quiz

1. Choose the number of questions you want to answer (5, 10, 15, 20, or all available words)
2. Click "Start Quiz" to begin
3. Read the Spanish word and select the correct English translation
4. Get instant feedback on your answer
5. Continue through all questions to see your final results

### Uploading Custom Vocabulary

1. Click the "Upload" button in the header
2. Select a JSON file or drag and drop it into the upload area
3. The file should follow this format:

```json
[
  {
    "spanish": "hola",
    "english": "hello",
    "category": "greetings",
    "difficulty": "easy"
  },
  {
    "spanish": "adiós",
    "english": "goodbye",
    "category": "greetings",
    "difficulty": "easy"
  }
]
```

**Required fields:**
- `spanish`: The Spanish word or phrase
- `english`: The English translation

**Optional fields:**
- `category`: Word category (e.g., "greetings", "food", "verbs")
- `difficulty`: Difficulty level ("easy", "medium", "hard")
- `id`: Unique identifier (auto-generated if not provided)

## Sample Vocabulary

The app loads vocabulary from `public/sample-vocabulary.json` which contains hundreds of Spanish words covering various categories:
- Core vocabulary (ser, estar, ir, decir, poder, etc.)
- Numbers (cero, uno, dos, tres, etc.)
- Grammar words (el, la, los, las, yo, tú, él, ella, etc.)
- Mixed vocabulary (temprano, tarde, también, etc.)
- And many more!

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with navigation
│   ├── WelcomeScreen.tsx # Initial welcome screen
│   ├── GameScreen.tsx  # Main quiz interface
│   ├── ResultsScreen.tsx # Results and statistics
│   └── FileUpload.tsx  # File upload modal
├── data/               # (removed - vocabulary now loaded from JSON)
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── utils/              # Utility functions
│   └── gameUtils.ts    # Game logic utilities
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Spanish Pronunciation Features

### High-Quality Spanish TTS
The app uses ElevenLabs AI for authentic Spanish pronunciation:

1. **Professional Quality**: Studio-grade Spanish voices
2. **Environment Configuration**: Uses .env file for API key
3. **Automatic Fallback**: Falls back to browser voices if needed
4. **Authentic Pronunciation**: Native Spanish speaker quality

### Setup Instructions

1. **Get ElevenLabs API Key**: Sign up at [elevenlabs.io](https://elevenlabs.io) for a free account
2. **Copy .env.example to .env**: `cp .env.example .env`
3. **Add Your API Key**: Edit `.env` and replace `your_elevenlabs_api_key_here` with your actual API key
4. **Start the App**: The app will automatically use high-quality voices

### Voice Features
- **ElevenLabs AI Voices**: Professional-grade Spanish pronunciation
- **Smart Fallback**: Automatically falls back if service is unavailable
- **Mobile Optimized**: Touch-friendly interface for all devices
- **Production Ready**: Optimized for deployment

### Adding New Features

The app is designed to be modular and extensible. Some ideas for future enhancements:

- **Difficulty Levels**: Filter questions by difficulty
- **Categories**: Filter by word categories
- **Spaced Repetition**: Show words you got wrong more frequently
- **User Accounts**: Save progress and statistics
- **Multiplayer**: Compete with friends
- **Flashcard Mode**: Study mode without multiple choice
- **More TTS Providers**: Add support for Azure Cognitive Services, Google Cloud TTS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team.

---

¡Buena suerte aprendiendo español! (Good luck learning Spanish!) 
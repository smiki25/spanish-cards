import { Upload, RotateCcw, BookOpen } from 'lucide-react';

interface HeaderProps {
  onUploadClick: () => void;
  onResetClick: () => void;
  gameStarted: boolean;
}

export default function Header({ onUploadClick, onResetClick, gameStarted }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Spanish Cards</h1>
              <p className="text-sm text-gray-600">Learn Spanish vocabulary with fun quizzes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onUploadClick}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              title="Upload vocabulary file"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            
            {gameStarted && (
              <button
                onClick={onResetClick}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
                title="Reset game"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 
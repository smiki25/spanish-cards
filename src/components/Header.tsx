import { Upload, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onUploadClick: () => void;
  onResetClick: () => void;
  gameStarted: boolean;
}

export default function Header({ onUploadClick, onResetClick, gameStarted }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Simple Spanish-themed logo */}
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
              <span className="text-2xl">🎸</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Spanish <span className="text-primary-600">Cards</span>
              </h1>
              <p className="text-sm text-gray-600">Learn vocabulary with fun</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onUploadClick}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
              title="Upload vocabulary file"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            
            {gameStarted && (
              <button
                onClick={onResetClick}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-colors duration-200 font-medium"
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
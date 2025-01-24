import { ModelSelector } from './ModelSelector';
import { Model } from '../types';

interface HeaderProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function Header({ models, selectedModel, onModelChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-gray-800 border-b border-gray-700">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Sunyata AI</h1>
            <p className="text-xs text-gray-400">Wisdom through Conversation</p>
          </div>
        </div>
        <ModelSelector
          models={models}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
        />
      </div>
    </header>
  );
}
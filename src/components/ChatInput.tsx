import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-700 bg-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Sunyata AI..."
            className="w-full resize-none bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 pr-24 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[56px] max-h-[200px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-indigo-600 transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
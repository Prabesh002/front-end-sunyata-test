import { User, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../types';
import { useEffect, useState, useRef } from 'react';

interface MessageItemProps {
  message: Message;
  animate?: boolean;
}

export function MessageItem({ message, animate }: MessageItemProps) {
  const isBot = message.role === 'assistant';
  const [thinkingText, setThinkingText] = useState('...');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract the thinking content if it exists
  const thinkMatch = message.content?.match(/<think>(.*?)<\/think>/s);
  const isThinking = !!thinkMatch;
  const thinkingContent = thinkMatch ? thinkMatch[1] : null;
  const contentToRender = thinkMatch
    ? message.content.replace(`<think>${thinkingContent}</think>`, '')
    : message.content;

  useEffect(() => {
    setShowDropdown(isThinking);
  }, [isThinking]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setThinkingText((prev) => {
          if (prev === '...') return '.  ';
          if (prev === '.  ') return '.. ';
          if (prev === '.. ') return '...';
          return '...';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setThinkingText('...');
    }
  }, [isThinking]);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const renderThinkingIndicator = () => {
    if (isThinking) {
      return (
        <div className="flex flex-col gap-2">
          {/* "Sunyata is thinking" text */}
          <span className="text-sm text-gray-400">Sunyata is thinking</span>

          {/* Dropdown for reasoning */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={handleToggleExpand}
              className="px-2 py-1 flex items-center gap-1 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              <span className="text-sm italic">{isExpanded ? thinkingContent : '...'}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`py-8 ${isBot ? 'bg-gray-800' : 'bg-gray-900'} transition-opacity duration-300 ${
        animate ? 'animate-fade-in' : ''
      }`}
    >
      <div className="max-w-3xl mx-auto px-6 flex gap-6">
        <div className="flex-shrink-0 mt-1">
          {isBot ? (
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center ${
                message.streaming ? 'animate-pulse' : ''
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-white">
              {isBot ? 'Sunyata AI' : 'You'}
            </span>
            {isBot && message.model && (
              <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {message.model}
              </span>
            )}
          </div>
          {renderThinkingIndicator()}
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg !my-4"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-700 rounded px-1 py-0.5" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {contentToRender}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
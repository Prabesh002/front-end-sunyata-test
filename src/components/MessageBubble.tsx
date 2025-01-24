import React from 'react';
import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../store';

interface MessageBubbleProps {
  message: Message;
  animate?: boolean;
}

export function MessageBubble({ message, animate }: MessageBubbleProps) {
  const isBot = message.role === 'assistant';

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
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { ModelSelector } from './components/ModelSelector';
import { useChatStore, wsClient } from './store';
import { Model } from './types';

const AVAILABLE_MODELS: Model[] = [
  {
    id: 'tinyllama',
    displayName: 'Sunyata 7B',
  },
  {
    id: 'deepseek-r1',
    displayName: "deepseek-r1"
  }
];

function App() {
  const { messages, selectedModel, setSelectedModel } = useChatStore();

  useEffect(() => {
    wsClient.connect();
  }, []);

  const handleSend = (content: string) => {
    wsClient.sendMessage(content);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Toaster theme="dark" position="top-center" />
      {/* Header */}
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
            models={AVAILABLE_MODELS}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 pt-16 pb-[76px]">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            animate={index === messages.length - 1}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
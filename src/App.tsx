import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { WebSocketManager } from './components/WebSocketManager';
import { useChatStore, wsClient } from './store';
import { Model } from './types';

const AVAILABLE_MODELS: Model[] = [
  {
    id: 'tinyllama',
    displayName: 'Sunyata 7B',
  },
  {
    id: 'deepseek-r1',
    displayName: 'Deepseek R1',
  },
];

function App() {
  const { messages, selectedModel, setSelectedModel } = useChatStore();

  const handleSend = (content: string) => {
    wsClient.sendMessage(content);
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  return (
    <>
      <Toaster theme="dark" position="top-center" />
      <WebSocketManager />
      <Header
        models={AVAILABLE_MODELS}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
      />
      <ChatContainer messages={messages} onSend={handleSend} />
    </>
  );
}

export default App;
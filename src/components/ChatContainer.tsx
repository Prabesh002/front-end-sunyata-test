import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { Message } from '../types';

interface ChatContainerProps {
  messages: Message[];
  onSend: (content: string) => void;
}

export function ChatContainer({ messages, onSend }: ChatContainerProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="flex-1 pt-16 pb-[76px]">
        <MessageList messages={messages} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
}
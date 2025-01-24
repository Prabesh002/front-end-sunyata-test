import { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatContainerRef} className="overflow-y-auto h-[calc(100vh-12rem)]">
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          animate={index === messages.length - 1}
        />
      ))}
    </div>
  );
}
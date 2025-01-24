import { create } from 'zustand';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  streaming?: boolean;
  model?: string;
}

interface ChatStore {
  messages: Message[];
  isTyping: boolean;
  selectedModel: string;
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'model'>) => void;
  setTyping: (typing: boolean) => void;
  setSelectedModel: (model: string) => void;
  appendToLastMessage: (content: string, isComplete?: boolean) => void;
  updateLastMessage: (content: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [{
    id: '1',
    role: 'assistant',
    content: 'Hello! I am Sunyata AI, your companion for insightful conversations. How can I assist you today?',
    timestamp: new Date(),
    model: '',
  }],
  isTyping: false,
  selectedModel: 'tinyllama',
  addMessage: (message) => {
    const selectedModel = get().selectedModel; 
    return set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
          streaming: message.role === 'assistant',
          model: message.role === 'assistant' ? selectedModel : undefined, 
        },
      ],
    }))
  },
  appendToLastMessage: (content, isComplete = false) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.role === 'assistant') {
        messages[messages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
          streaming: !isComplete,
        };
      } else {
        messages.push({
          id: crypto.randomUUID(),
          content,
          role: 'assistant',
          timestamp: new Date(),
          streaming: !isComplete,
        });
      }

      return { messages, isTyping: !isComplete };
    }),
  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.role === 'assistant') {
        messages[messages.length - 1] = {
          ...lastMessage,
          content,
          streaming: false,
        };
      }

      return { messages, isTyping: false };
    }),
  setTyping: (typing) => set({ isTyping: typing }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
}));

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private isConnected: boolean = false;
  private messageQueue: string[] = [];
  private isProcessing: boolean = false;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.isConnected) {
      console.log("WebSocket already connected.");
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected to WebSocket');
      this.isConnected = true;
      this.processQueue();
    };

    this.ws.onmessage = (event) => {
      this.messageQueue.push(event.data);
      if (!this.isProcessing) {
        this.processQueue();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error occurred');
      this.isConnected = false;
      this.ws = null;
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      this.ws = null;
      setTimeout(() => this.connect(), 5000);
    };
  }

  private async processQueue() {
    if (this.isProcessing) return;
  
    this.isProcessing = true;
  
    while (this.messageQueue.length > 0) {
      const eventData = this.messageQueue.shift();
      if (!eventData) continue;
  
      const data = JSON.parse(eventData);
      const store = useChatStore.getState();
  
      if (data.error) {
        toast.error(data.error);
        store.addMessage({
          content: data.error,
          role: 'assistant',
        });
        continue;
      }
  
      if (data.response) {
        store.appendToLastMessage(data.response, data.end);
      }
    }
  
    this.isProcessing = false;
  }

  async sendMessage(content: string) {
    const store = useChatStore.getState();

    store.addMessage({
      content,
      role: 'user',
    });
    
    try {
      await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          model: store.selectedModel,
        }),
      });
    } catch (error) {
      console.error('Request Error:', error);
      toast.error('Failed to send message');
      store.updateLastMessage('Error sending message');
    }
  }
}

export const wsClient = new WebSocketClient('ws://localhost:3000');
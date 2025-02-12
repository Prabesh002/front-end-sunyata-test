export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
  streaming?: boolean;
}

export interface Model {
  id: string;
  displayName: string;
}

export interface ChatThread {
  messages: Message[];
  selectedModel: string;
}
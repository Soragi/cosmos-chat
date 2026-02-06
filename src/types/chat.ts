export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'active' | 'completed';
  x: number;
  y: number;
}

export interface ChatSettings {
  backendUrl: string;
  animationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: ChatSettings = {
  backendUrl: 'http://localhost:3838',
  animationsEnabled: true,
};

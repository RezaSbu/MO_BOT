export enum MessageRole {
  USER = 'user',
  AI = 'ai',
  SYSTEM = 'system',
}

export interface GroundingSource {
  uri: string;
  title: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  image?: {
    url: string;
    name: string;
  };
  sources?: GroundingSource[];
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
}
// src/chatbot/types.ts
import { Runner } from '../services/runnerService';

export interface ChatbotParams {
  runners?: Runner[];
  userName?: string;
  userLocation?: {
    lat: number;
    lng: number;
    city: string;
  };
  setActiveCategory?: (category: string | null) => void;
  setSearchTerm?: (term: string) => void;
  scrollToRunners?: () => void;
  setSelectedRunner?: (runner: Runner | null) => void;
  navigate?: (path: string) => void;
}

export interface ActionProviderProps {
  createChatBotMessage: any;
  setState: any;
  createClientMessage?: any;
  params: ChatbotParams;
}

export interface MessageParserProps {
  actionProvider: any;
}
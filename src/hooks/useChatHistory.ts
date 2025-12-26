import { useState, useEffect, useCallback } from 'react';
import { Message } from './useChat';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'abbas-chat-history';

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        })));
      } catch {
        // Invalid data
      }
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const createSession = useCallback((): string => {
    const id = crypto.randomUUID();
    const session: ChatSession = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions(prev => [session, ...prev]);
    setCurrentSessionId(id);
    return id;
  }, []);

  const updateSession = useCallback((id: string, messages: Message[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== id) return s;
      
      // Generate title from first user message
      const firstUserMessage = messages.find(m => m.role === 'user');
      const title = firstUserMessage 
        ? firstUserMessage.content.slice(0, 40) + (firstUserMessage.content.length > 40 ? '...' : '')
        : 'New Chat';
      
      return {
        ...s,
        title,
        messages,
        updatedAt: new Date(),
      };
    }));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const selectSession = useCallback((id: string) => {
    setCurrentSessionId(id);
  }, []);

  const getCurrentSession = useCallback((): ChatSession | null => {
    return sessions.find(s => s.id === currentSessionId) || null;
  }, [sessions, currentSessionId]);

  return {
    sessions,
    currentSessionId,
    createSession,
    updateSession,
    deleteSession,
    selectSession,
    getCurrentSession,
    setCurrentSessionId,
  };
}

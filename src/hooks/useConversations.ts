import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message } from '@/types/chat';

const STORAGE_KEY = 'aiq-conversations';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hydrated = parsed.map((conv: Conversation) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setConversations(hydrated);
        if (hydrated.length > 0) {
          setActiveConversationId(hydrated[0].id);
        }
      } catch (e) {
        console.error('Failed to parse stored conversations:', e);
      }
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const createConversation = useCallback(() => {
    const newConv: Conversation = {
      id: uuidv4(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(conversations.find(c => c.id !== id)?.id || null);
    }
  }, [activeConversationId, conversations]);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title, updatedAt: new Date() } : c))
    );
  }, []);

  const addMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date(),
    };
    
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        const updatedMessages = [...c.messages, newMessage];
        // Auto-generate title from first user message
        const title = c.messages.length === 0 && message.role === 'user'
          ? message.content.slice(0, 40) + (message.content.length > 40 ? '...' : '')
          : c.title;
        return {
          ...c,
          messages: updatedMessages,
          title,
          updatedAt: new Date(),
        };
      })
    );
    
    return newMessage;
  }, []);

  const updateMessage = useCallback((conversationId: string, messageId: string, content: string, isStreaming?: boolean) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.map(m =>
            m.id === messageId ? { ...m, content, isStreaming } : m
          ),
          updatedAt: new Date(),
        };
      })
    );
  }, []);

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    renameConversation,
    addMessage,
    updateMessage,
    clearAllConversations,
  };
}

import { useState, useCallback, useRef } from 'react';
import { Message, ChatSettings, DEFAULT_SETTINGS, AgentStatus } from '@/types/chat';

const SETTINGS_KEY = 'aiq-settings';

export function useChat(
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message,
  updateMessage: (conversationId: string, messageId: string, content: string, isStreaming?: boolean) => void
) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load settings from localStorage
  const getSettings = useCallback((): ChatSettings => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  }, []);

  const saveSettings = useCallback((settings: Partial<ChatSettings>) => {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }, [getSettings]);

  // Test backend connection
  const testConnection = useCallback(async (url?: string): Promise<boolean> => {
    const settings = getSettings();
    const testUrl = url || settings.backendUrl;
    
    try {
      const response = await fetch(`${testUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      const connected = response.ok;
      setIsConnected(connected);
      return connected;
    } catch {
      setIsConnected(false);
      return false;
    }
  }, [getSettings]);

  // Simulate agent activity during streaming
  const simulateAgentActivity = useCallback(() => {
    const agentNames = ['Orchestrator', 'Research', 'Analysis', 'Synthesis', 'Validation'];
    const initialAgents: AgentStatus[] = agentNames.map((name, i) => ({
      id: `agent-${i}`,
      name,
      status: 'idle',
      x: Math.cos((i / agentNames.length) * Math.PI * 2) * 60,
      y: Math.sin((i / agentNames.length) * Math.PI * 2) * 60,
    }));
    setAgents(initialAgents);

    // Activate agents sequentially
    let currentIndex = 0;
    const interval = setInterval(() => {
      setAgents(prev => prev.map((agent, i) => ({
        ...agent,
        status: i === currentIndex ? 'active' : i < currentIndex ? 'completed' : 'idle',
      })));
      currentIndex = (currentIndex + 1) % agentNames.length;
    }, 800);

    return () => {
      clearInterval(interval);
      setAgents([]);
    };
  }, []);

  // Send message and handle streaming response
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string
  ): Promise<void> => {
    if (!content.trim() || isStreaming) return;

    const settings = getSettings();

    // Add user message
    addMessage(conversationId, { role: 'user', content });

    // Add empty assistant message for streaming
    const assistantMessage = addMessage(conversationId, {
      role: 'assistant',
      content: '',
      isStreaming: true,
    });

    setIsStreaming(true);
    const cleanupAgents = simulateAgentActivity();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${settings.backendUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_message: content }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          
          // Parse SSE events
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  fullContent += data.text;
                  updateMessage(conversationId, assistantMessage.id, fullContent, true);
                }
              } catch {
                // If not JSON, treat as plain text
                fullContent += line.slice(6);
                updateMessage(conversationId, assistantMessage.id, fullContent, true);
              }
            } else if (line.trim() && !line.startsWith(':')) {
              // Plain text streaming
              fullContent += line;
              updateMessage(conversationId, assistantMessage.id, fullContent, true);
            }
          }
        }
      }

      // Finalize message
      updateMessage(conversationId, assistantMessage.id, fullContent || 'No response received.', false);
      setIsConnected(true);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        updateMessage(conversationId, assistantMessage.id, 'Message cancelled.', false);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updateMessage(
          conversationId,
          assistantMessage.id,
          `⚠️ Connection error: ${errorMessage}\n\nPlease check that your backend is running at ${settings.backendUrl}`,
          false
        );
        setIsConnected(false);
      }
    } finally {
      setIsStreaming(false);
      cleanupAgents();
      abortControllerRef.current = null;
    }
  }, [isStreaming, getSettings, addMessage, updateMessage, simulateAgentActivity]);

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return {
    isStreaming,
    isConnected,
    agents,
    sendMessage,
    cancelStream,
    testConnection,
    getSettings,
    saveSettings,
  };
}

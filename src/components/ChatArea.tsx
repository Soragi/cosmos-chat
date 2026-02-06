import { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { AgentOrchestration } from './AgentOrchestration';
import { Message, AgentStatus } from '@/types/chat';
import { Bot } from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
  agents: AgentStatus[];
  animationsEnabled: boolean;
  onSend: (message: string) => void;
  onCancel: () => void;
}

export function ChatArea({
  messages,
  isStreaming,
  agents,
  animationsEnabled,
  onSend,
  onCancel,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // Detect manual scroll
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setAutoScroll(isAtBottom);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1"
      >
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 nvidia-glow">
              <Bot size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              AIQ Research Assistant
            </h1>
            <p className="text-muted-foreground text-center max-w-md">
              Powered by NVIDIA's agentic AI framework. Ask questions about research,
              analyze documents, or explore complex topics.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {[
                'What are the latest advances in quantum computing?',
                'Explain transformer architecture in simple terms',
                'Summarize recent AI safety research',
                'Compare different GPU architectures',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSend(suggestion)}
                  className="p-3 text-left text-sm rounded-lg bg-secondary/50 hover:bg-secondary border border-border transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Agent Orchestration Animation */}
      {animationsEnabled && isStreaming && (
        <div className="border-t border-border bg-card/30 backdrop-blur-sm">
          <AgentOrchestration agents={agents} isActive={isStreaming} />
        </div>
      )}

      {/* Input Area */}
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput
          onSend={onSend}
          onCancel={onCancel}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}

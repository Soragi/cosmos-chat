import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 px-4 py-6 animate-fade-in',
        isUser ? 'bg-transparent' : 'bg-secondary/30'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          isUser
            ? 'bg-accent text-accent-foreground'
            : 'bg-primary text-primary-foreground nvidia-glow'
        )}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          {isUser ? 'You' : 'AIQ Research Assistant'}
        </div>
        
        <div
          className={cn(
            'prose prose-invert prose-sm max-w-none',
            'prose-headings:text-foreground prose-headings:font-semibold',
            'prose-p:text-foreground/90 prose-p:leading-relaxed',
            'prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
            'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
            'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
            'prose-strong:text-foreground',
            'prose-ul:text-foreground/90 prose-ol:text-foreground/90',
            message.isStreaming && 'streaming-cursor'
          )}
        >
          <ReactMarkdown>{message.content || ' '}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
});

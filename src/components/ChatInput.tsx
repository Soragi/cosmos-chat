import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSend: (message: string) => void;
  onCancel: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onCancel, isStreaming, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isStreaming && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-end gap-3 p-4 bg-card/50 backdrop-blur-sm border-t border-border">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask AIQ Research Assistant anything..."
        disabled={disabled || isStreaming}
        className="min-h-[52px] max-h-[200px] resize-none bg-secondary/50 border-border focus:border-primary focus:ring-1 focus:ring-primary"
        rows={1}
      />
      
      {isStreaming ? (
        <Button
          onClick={onCancel}
          variant="destructive"
          size="icon"
          className="flex-shrink-0 h-[52px] w-[52px]"
        >
          <Square size={20} />
        </Button>
      ) : (
        <Button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          size="icon"
          className="flex-shrink-0 h-[52px] w-[52px] bg-primary hover:bg-primary/90 nvidia-glow disabled:opacity-50 disabled:nvidia-glow-none"
        >
          <Send size={20} />
        </Button>
      )}
    </div>
  );
}

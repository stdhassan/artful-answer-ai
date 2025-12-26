import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Image, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    { icon: Code, label: 'Write code', prompt: 'Write a function that ' },
    { icon: Image, label: 'Generate image', prompt: 'Generate an image of ' },
    { icon: FileText, label: 'Explain concept', prompt: 'Explain how ' },
  ];

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4 md:p-6">
      {/* Quick suggestions */}
      {!input && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => setInput(suggestion.prompt)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              <suggestion.icon className="h-4 w-4" />
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="gradient-border">
          <div className="flex items-end gap-2 bg-card rounded-xl p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything... Generate code, images, infographics..."
              rows={1}
              disabled={isLoading}
              className={cn(
                'flex-1 bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground',
                'min-h-[24px] max-h-[200px]'
              )}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              variant="gradient"
              size="icon"
              className="h-10 w-10 shrink-0"
            >
              {isLoading ? (
                <Sparkles className="h-4 w-4 animate-pulse" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-3">
        Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}

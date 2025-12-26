import React from 'react';
import { Sparkles, Trash2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onClear: () => void;
  hasMessages: boolean;
}

export function ChatHeader({ onClear, hasMessages }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg gradient-text">NexusAI</h1>
          <p className="text-xs text-muted-foreground">Powered by AI</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </header>
  );
}

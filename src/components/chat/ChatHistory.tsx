import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';
import { ChatSession } from '@/hooks/useChatHistory';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatHistory({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose,
}: ChatHistoryProps) {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-72 bg-card border-border z-50 flex flex-col ${isRTL ? 'border-l' : 'border-r'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{t('history')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3">
          <Button 
            onClick={onNewChat} 
            className="w-full gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            {t('newChat')}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              {t('noHistory')}
            </p>
          ) : (
            <div className="space-y-2 pb-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    session.id === currentSessionId
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm truncate text-foreground">
                    {session.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>
    </>
  );
}

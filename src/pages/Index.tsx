import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useChat, Message } from '@/hooks/useChat';
import { useChatHistory } from '@/hooks/useChatHistory';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/chat/EmptyState';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { messages, setMessages, isLoading, sendMessage, clearChat } = useChat();
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    updateSession, 
    deleteSession, 
    selectSession,
    getCurrentSession,
    setCurrentSessionId,
  } = useChatHistory();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { t } = useLanguage();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sync messages with current session
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      updateSession(currentSessionId, messages);
    }
  }, [messages, currentSessionId, updateSession]);

  // Load session messages when selecting a session
  const handleSelectSession = useCallback((id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setMessages(session.messages);
      selectSession(id);
      setHistoryOpen(false);
    }
  }, [sessions, setMessages, selectSession]);

  // Create new chat
  const handleNewChat = useCallback(() => {
    const id = createSession();
    setMessages([]);
    setHistoryOpen(false);
  }, [createSession, setMessages]);

  // Clear current chat
  const handleClearChat = useCallback(() => {
    clearChat();
    setCurrentSessionId(null);
  }, [clearChat, setCurrentSessionId]);

  // Send message with session management
  const handleSendMessage = useCallback((content: string) => {
    if (!currentSessionId) {
      createSession();
    }
    sendMessage(content);
  }, [currentSessionId, createSession, sendMessage]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat History Sidebar */}
      <ChatHistory
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={deleteSession}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col h-full max-w-5xl mx-auto w-full">
        <ChatHeader 
          onClear={handleClearChat} 
          hasMessages={messages.length > 0} 
          onToggleHistory={() => setHistoryOpen(!historyOpen)}
        />

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="p-4 md:p-6 space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex items-center gap-3 text-muted-foreground animate-fade-in">
                  <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                  <span className="text-sm">{t('thinking')}</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
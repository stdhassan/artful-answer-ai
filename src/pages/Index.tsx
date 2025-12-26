import React, { useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/chat/EmptyState';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col h-full max-w-5xl mx-auto w-full">
        <ChatHeader onClear={clearChat} hasMessages={messages.length > 0} />

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
                  <span className="text-sm">NexusAI is thinking...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;

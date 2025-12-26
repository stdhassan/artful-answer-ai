import React, { useState } from 'react';
import { Bot, User, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Message } from '@/hooks/useChat';
import { CodeBlock } from './CodeBlock';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const copyContent = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (message.imageUrl) {
      const link = document.createElement('a');
      link.href = message.imageUrl;
      link.download = `nexus-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded');
    }
  };

  // Parse content for code blocks
  const renderContent = () => {
    if (message.type === 'image' && message.imageUrl) {
      return (
        <div className="space-y-3">
          {message.content && <p className="text-foreground/90">{message.content}</p>}
          <div className="relative group">
            <img
              src={message.imageUrl}
              alt="Generated image"
              className="rounded-lg max-w-full h-auto shadow-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={downloadImage}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      );
    }

    // Parse markdown code blocks
    const parts = message.content.split(/(```[\s\S]*?```)/g);
    
    return (
      <div className="space-y-3">
        {parts.map((part, index) => {
          if (part.startsWith('```')) {
            const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
            if (match) {
              const language = match[1] || 'text';
              const code = match[2].trim();
              return <CodeBlock key={index} code={code} language={language} />;
            }
          }
          
          // Regular text - render with basic markdown
          if (part.trim()) {
            return (
              <div 
                key={index} 
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: part
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-primary">$1</code>')
                    .replace(/\n/g, '<br />')
                }}
              />
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'flex gap-4 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
          isUser
            ? 'bg-gradient-to-br from-primary to-accent'
            : 'bg-secondary border border-border'
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-primary" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%] rounded-2xl px-5 py-4',
          isUser
            ? 'bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30'
            : 'bg-card border border-border'
        )}
      >
        {renderContent()}

        {/* Actions */}
        {!isUser && message.content && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyContent}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 mr-1" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

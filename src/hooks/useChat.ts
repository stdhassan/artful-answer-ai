import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'code';
  imageUrl?: string;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      type: 'text',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Check if this is an image generation request
    const isImageRequest = /\b(generate|create|make|draw|design)\b.*\b(image|picture|photo|illustration|infographic|diagram|visual)\b/i.test(content);

    if (isImageRequest) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { prompt: content },
        });

        if (error) throw error;

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.description || 'Here\'s your generated image:',
          type: 'image',
          imageUrl: data.imageUrl,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Image generation error:', error);
        toast.error('Failed to generate image. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Regular chat message with streaming
    const chatHistory = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...chatHistory, { role: 'user', content }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let messageId = crypto.randomUUID();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages(prev => {
                const existing = prev.find(m => m.id === messageId);
                if (existing) {
                  return prev.map(m =>
                    m.id === messageId ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, {
                  id: messageId,
                  role: 'assistant' as const,
                  content: assistantContent,
                  type: 'text' as const,
                  timestamp: new Date(),
                }];
              });
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  };
}

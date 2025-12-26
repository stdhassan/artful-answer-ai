import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      sql: 'sql',
      bash: 'sh',
      shell: 'sh',
    };
    
    const ext = extensions[language.toLowerCase()] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `code.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border bg-background/50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {language}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="h-7 px-2 text-xs"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadCode}
            className="h-7 px-2 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto scrollbar-thin">
        <code className="text-sm font-mono text-foreground/90 leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}

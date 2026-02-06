import React, { useState } from 'react';
import { Send, Smile, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend?: (message: string) => void;
  className?: string;
}

const MAX_LENGTH = 2000;

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, className }) => {
  const [message, setMessage] = useState('');
  
  const isTooLong = message.length > MAX_LENGTH;
  const isNotEmpty = message.trim().length > 0;
  const canSend = isNotEmpty && !isTooLong;

  const handleSend = () => {
    if (canSend && onSend) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className={cn('p-4 bg-background border-t border-border', className)}>
      <div className="relative flex flex-col gap-2">
        <div className="relative flex items-center gap-2 bg-muted/30 border border-border rounded-full px-4 py-1.5 transition-colors">
          <button className="p-1 hover:text-primary transition-colors">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something..."
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm py-2"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />

          <div className="flex items-center gap-1">
            {!message.trim() && (
              <button className="p-1 hover:text-primary transition-colors opacity-40 cursor-not-allowed">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            
            <button 
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                'p-2 rounded-full transition-all active:scale-90',
                canSend ? 'bg-primary text-primary-foreground' : 'text-muted-foreground opacity-20'
              )}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
        
        {message.length > MAX_LENGTH * 0.8 && (
          <div className="flex justify-end px-4">
            <span className={cn(
              "text-[10px] font-medium tracking-widest uppercase",
              isTooLong ? "text-destructive" : "text-muted-foreground opacity-40"
            )}>
              {message.length} / {MAX_LENGTH}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

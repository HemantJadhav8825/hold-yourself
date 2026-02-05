import React, { useState } from 'react';
import { Send, Smile, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend?: (message: string) => void;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, className }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className={cn('p-4 bg-background border-t border-border', className)}>
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
            disabled={!message.trim()}
            className={cn(
              'p-2 rounded-full transition-all active:scale-90',
              message.trim() ? 'bg-primary text-primary-foreground' : 'text-muted-foreground opacity-20'
            )}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

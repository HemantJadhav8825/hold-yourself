import React from 'react';
import { MessageRequestItem } from './MessageRequestItem';
import { Text } from '@/components/ui/Text';
import { ChevronLeft } from 'lucide-react';

interface Request {
  id: string;
  name: string;
  avatar?: string;
  intro?: string;
}

interface MessageRequestsListProps {
  requests?: Request[];
  activeRequestId?: string;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export const MessageRequestsList: React.FC<MessageRequestsListProps> = ({
  requests = [],
  activeRequestId,
  onSelect,
  onBack,
}) => {
  // Scaffolding mock requests
  const displayRequests = requests.length > 0 ? requests : [
    { id: 'req1', name: 'soul_searcher', intro: 'Found your recent reflection very resonant.' },
    { id: 'req2', name: 'gentle_breeze', intro: 'Hi! Would love to chat about the meditation group.' },
  ];

  return (
    <div className="h-full flex flex-col bg-background lg:border-r border-border">
      <div className="p-4 lg:p-6 pb-2 lg:pb-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <Text weight="bold" className="text-xl lg:text-2xl">Requests</Text>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-border/50">
        <Text size="xs" muted className="leading-relaxed">
          Invitations from people you don't follow. They won't know you've seen the message until you accept.
        </Text>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 no-scrollbar">
        {displayRequests.map((req) => (
          <MessageRequestItem 
            key={req.id}
            {...req}
            isActive={activeRequestId === req.id}
            onClick={() => onSelect(req.id)}
          />
        ))}
      </div>
    </div>
  );
};

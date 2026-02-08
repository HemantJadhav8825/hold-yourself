"use client"

import { useConversationsContext } from "@/context/ConversationsContext"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function ChatOverview() {
  const { conversations, isLoading } = useConversationsContext()
  const { user } = useCurrentUser()
  const router = useRouter()

  // Filter and sort conversations
  const recentConversations = conversations
    .slice(0, 3); // Take top 3

  if (isLoading) {
      return (
          <section className="max-w-xl mx-auto mb-16 px-4 flex justify-center opacity-50">
             <Loader2 className="h-4 w-4 animate-spin" />
          </section>
      )
  }

  const hasConversations = recentConversations.length > 0;

  return (
    <section className="max-w-xl mx-auto mb-16 px-4">
      {!hasConversations ? (
        <div className="text-center py-12 border-t border-b border-border/50">
          <p className="text-muted-foreground font-serif italic text-lg opacity-80">
            Conversations happen when they’re ready.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {recentConversations.map((chat) => {
             // Find the other participant
             // Participants can be string or object. If object, use displayName or username.
             const otherParticipant = chat.participants.find(p => {
                 const pId = typeof p === 'string' ? p : p.id;
                 return pId !== user?.id;
             });

             let name = "Unknown";
             if (otherParticipant && typeof otherParticipant !== 'string') {
                 name = otherParticipant.displayName || otherParticipant.username;
             }

             // Format time nicely (e.g., "Just now", "2h", "1d")
             const date = new Date(chat.lastMessageAt);
             const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

             return (
                 <div 
                    key={chat.id} 
                    className="p-4 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/messages/${chat.id}`)}
                 >
                   <div className="flex justify-between items-baseline">
                     <span className="font-medium text-foreground/80 group-hover:text-foreground text-sm font-heading">{name}</span>
                     <span className="text-xs text-muted-foreground/40 font-serif">{timeString}</span>
                   </div>
                   <div className="text-xs text-muted-foreground/60 truncate mt-1 group-hover:text-muted-foreground/80 transition-colors">
                       {chat.lastMessageContent || "Starting a conversation..."}
                   </div>
                 </div>
             )
          })}
        </div>
      )}
    </section>
  )
}

import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { AnonymousAvatar } from "@/components/ui/anonymous-avatar"
import { Badge } from "@/components/ui/Badge"

export interface Vent {
  id: string
  content: string
  mood: string
  createdAt: string
  expiresAt: string
  author: {
    id: string
    pseudonym: string
    color: string
  }
  reactions: Array<{
    emoji: string
    count: number
    users: string[]
  }>
}

interface VentCardProps {
  vent: Vent
  onReact: (id: string, emoji: string) => void
}

export function VentCard({ vent, onReact }: VentCardProps) {
  const timeLeft = new Date(vent.expiresAt).getTime() - Date.now()
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))
  
  // Construct seed for AnonymousAvatar (Format: "HEX:INITIALS")
  const initials = vent.author.pseudonym
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const avatarSeed = `${vent.author.color}:${initials}`;

  return (
    <Card className="mb-4 overflow-hidden border-l-4 border-l-primary/40">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 text-sm pb-2">
        <AnonymousAvatar seed={avatarSeed} size="sm" />
        <div className="flex flex-col">
          <span className="font-semibold">{vent.author.pseudonym}</span>
          <span className="text-xs text-muted-foreground">
             {formatDistanceToNow(new Date(vent.createdAt))} ago • {hoursLeft}h left
          </span>
        </div>
        {vent.mood && <Badge variant="secondary" className="ml-auto text-xs">{vent.mood}</Badge>}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap leading-relaxed">{vent.content}</p>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => onReact(vent.id, 'heart')}>
          <Heart className="h-4 w-4" />
          <span className="text-xs">Support</span>
        </Button>
        <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => onReact(vent.id, 'hug')}>
            🫂 Hug
        </Button>
         <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={() => onReact(vent.id, 'same')}>
            ✋ Me too
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

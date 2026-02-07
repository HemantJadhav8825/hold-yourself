import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Users, ArrowRight } from "lucide-react"

export interface Circle {
  id: string
  name: string
  description: string
  subscribers: string[]
  tags: string[]
}

interface CircleCardProps {
  circle: Circle
  isJoined?: boolean
  onJoin?: (id: string) => void
  onLeave?: (id: string) => void
  onView?: (id: string) => void
}

export function CircleCard({ circle, isJoined, onJoin, onLeave, onView }: CircleCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex justify-between items-start">
          <span>{circle.name}</span>
          {isJoined && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Joined</span>}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {circle.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {circle.tags.map(tag => (
            <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">#{tag}</span>
          ))}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="h-4 w-4 mr-1" />
          {circle.subscribers.length} outcomes
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {onView && (
          <Button variant="outline" className="flex-1" onClick={() => onView(circle.id)}>
            View
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isJoined ? (
          <Button variant="ghost" className="text-muted-foreground" onClick={() => onLeave?.(circle.id)}>
            Leave
          </Button>
        ) : (
          <Button variant="default" onClick={() => onJoin?.(circle.id)}>
            Join
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

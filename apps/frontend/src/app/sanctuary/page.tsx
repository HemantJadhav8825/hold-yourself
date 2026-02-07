"use client"

import { useEffect, useState } from "react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter } from "next/navigation"
import client from "@/api/client"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card"
import { Loader2, Users, MessageCircle } from "lucide-react"

interface CircleSummary {
    id: string
    name: string
    description: string
}

export default function SanctuaryPage() {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()
  const [checkingIdentity, setCheckingIdentity] = useState(true)
  const [myCircles, setMyCircles] = useState<CircleSummary[]>([])

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    if (user.anonymousProfile) {
      // Fetch my circles
      const fetchMyCircles = async () => {
          try {
            // Use gateway URL (configured in client) instead of direct service URL
            const res = await client.get(`/v1/circles/my?userId=${user.id}`)
            setMyCircles(res.data)
          } catch (e) {
              console.error(e)
          } finally {
            setCheckingIdentity(false)
          }
      }
      fetchMyCircles()
    } else {
      router.push('/sanctuary/setup')
    }
  }, [user, isLoading, router])

  if (isLoading || checkingIdentity) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          A moment of quiet.
        </h1>
        <p className="text-muted-foreground text-lg">
          Speak your mind safely. Your presence here is ephemeral.
        </p>
      </div>

      <div className="space-y-8 mb-16">
        {/* Circles Flow - Primary prompt if they have circles */}
        {myCircles.length > 0 && (
          <Card className="border-border bg-card shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Continue your conversations</CardTitle>
              </div>
              <CardDescription>Topic-specific spaces you've joined.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                  {myCircles.slice(0, 3).map(circle => (
                      <div key={circle.id} 
                           onClick={() => router.push(`/sanctuary/circles/${circle.id}`)}
                           className="p-4 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer flex justify-between items-center transition-colors">
                          <span className="text-sm font-medium">{circle.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Open</span>
                      </div>
                  ))}
              </div>
              <div className="pt-2">
                  <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => router.push('/sanctuary/circles')}>
                  Find more circles
                  </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Global Vent / Feed Flow - Always leading towards the action */}
        <Card className="border-border bg-card shadow-none overflow-hidden">
          <CardContent className="p-0">
            <div className="p-8 text-center border-b border-border/50 bg-muted/20">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-medium mb-2">The Feed</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Shared thoughts that disappear after 24 hours. Release without dependency.
              </p>
              <Button size="lg" className="px-8 rounded-full" onClick={() => router.push('/sanctuary/feed')}>
                Release a thought
              </Button>
            </div>
            {myCircles.length === 0 && (
              <div className="p-4 bg-muted/10 text-center">
                <Button variant="link" className="text-xs text-muted-foreground" onClick={() => router.push('/sanctuary/circles')}>
                  Or find a specific circle to join
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center pt-8 border-t border-dashed border-border text-center">
          <p className="text-xs text-muted-foreground mb-4">
              You&apos;re not alone. This will pass.
          </p>
          <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground transition-colors" onClick={() => router.push('/dashboard')}>
              Return to We belong
          </Button>
      </div>
    </div>
  )
}

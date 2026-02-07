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
    <div className="container py-10 max-w-4xl">
      <div className="mb-10 p-8 rounded-2xl border border-border bg-muted/30">
        <h1 className="text-2xl font-semibold tracking-tight mb-3">
          A temporary space for your thoughts.
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Speak your mind safely. Your presence here is ephemeral.
          Nothing you share is permanent.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {/* Circles Card */}
        <Card className="border-border bg-card flex flex-col shadow-none">
          <CardHeader className="pb-3 text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <Users className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-lg">Circles</CardTitle>
            </div>
            <CardDescription>Topic-specific spaces.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            {myCircles.length > 0 ? (
                <div className="space-y-2">
                    {myCircles.slice(0, 3).map(circle => (
                        <div key={circle.id} 
                             onClick={() => router.push(`/sanctuary/circles/${circle.id}`)}
                             className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer flex justify-between items-center transition-colors">
                            <span className="text-sm font-medium">{circle.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Enter</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground italic text-center md:text-left">No circles joined.</p>
            )}
            <div className="pt-2">
                <Button variant="ghost" className="w-full text-xs" onClick={() => router.push('/sanctuary/circles')}>
                Browse Circles
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Global Vent / Feed Card */}
        <Card className="border-border bg-card flex flex-col shadow-none">
          <CardHeader className="pb-3 text-center md:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-lg">The Void</CardTitle>
            </div>
            <CardDescription>Global ephemeral feed.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <p className="text-sm text-muted-foreground mb-6 text-center md:text-left">
                Thoughts disappear after 24 hours. Release without dependency.
            </p>
            <Button variant="outline" className="w-full" onClick={() => router.push('/sanctuary/feed')}>
              Vent anonymously
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center pt-8 border-t border-dashed border-border text-center">
          <p className="text-sm text-muted-foreground mb-6">
              You&apos;re not alone. This will pass. You still belong.
          </p>
          <Button variant="link" className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => router.push('/dashboard')}>
              Return to We belong
          </Button>
      </div>
    </div>
  )
}

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
      setCheckingIdentity(false)
      // Fetch my circles
      const fetchMyCircles = async () => {
          try {
            // Use gateway URL (configured in client) instead of direct service URL
            const res = await client.get(`/v1/circles/my?userId=${user.id}`)
            setMyCircles(res.data)
          } catch (e) {
              console.error(e)
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Entering the sanctuary...</span>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-4xl">
      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 shadow-sm">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 mb-2">
          Welcome, {user?.anonymousProfile?.pseudonym}
        </h1>
        <p className="text-muted-foreground">
          This is your safe space. Connect, share, and heal without judgment.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Circles Card */}
        <Card className="hover:shadow-md transition-shadow border-t-4 border-t-purple-400 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <Users className="h-5 w-5" />
                </div>
                <CardTitle>My Circles</CardTitle>
            </div>
            <CardDescription>Your communities.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            {myCircles.length > 0 ? (
                <div className="space-y-2">
                    {myCircles.slice(0, 3).map(circle => (
                        <div key={circle.id} 
                             onClick={() => router.push(`/sanctuary/circles/${circle.id}`)}
                             className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer flex justify-between items-center transition-colors">
                            <span className="font-medium">{circle.name}</span>
                            <span className="text-xs text-muted-foreground">View &rarr;</span>
                        </div>
                    ))}
                    {myCircles.length > 3 && (
                        <p className="text-xs text-center text-muted-foreground">+{myCircles.length - 3} more</p>
                    )}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground italic">You haven't joined any circles yet.</p>
            )}
            <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => router.push('/sanctuary/circles')}>
                Browse All Circles
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Global Vent / Feed Card */}
        <Card className="hover:shadow-md transition-shadow border-t-4 border-t-amber-400 flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <MessageCircle className="h-5 w-5" />
                </div>
                <CardTitle>The Vent</CardTitle>
            </div>
            <CardDescription>Share ephemeral thoughts safely with everyone.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <p className="text-sm text-muted-foreground mb-4">
                "The Void" is a global feed where posts disappear in 24 hours. No judgment, just release.
            </p>
            <Button variant="default" className="w-full bg-amber-600 hover:bg-amber-700 text-white" onClick={() => router.push('/sanctuary/feed')}>
              Enter The Void
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

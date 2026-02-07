"use client"

import { useEffect, useState, useCallback } from "react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import client from "@/api/client"
import { VentCard, Vent } from "@/components/sanctuary/vent-card"
import { CreateVent } from "@/components/sanctuary/create-vent"
import { Button } from "@/components/ui/Button"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GlobalFeedPage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  
  const [vents, setVents] = useState<Vent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVents = useCallback(async () => {
    try {
        const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
        
        // Fetch global feed (no circle filter)
        const res = await client.get(`${chatApiUrl}/v1/vents`)
        setVents(res.data)
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVents()
  }, [fetchVents])

  const handleReact = async (ventId: string, emoji: string) => {
    try {
        const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
        await client.post(`${chatApiUrl}/v1/vents/${ventId}/react`, { emoji, userId: user?.id })
        fetchVents()
    } catch (error) {
        console.error("Failed to react", error)
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sanctuary
      </Button>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-amber-600 mb-2">
            The Void
        </h1>
        <p className="text-muted-foreground">Global ephemeral thoughts. Speak your mind.</p>
      </div>

      {/* Typically "The Void" might not allow posting directly without a Circle, or maybe it posts to a "General" circle? 
          For now let's omit posting directly to "The Void" unless we have a general/null circle support.
          My implementation of CreateVent requires a circleId.
          Actually, let's just show the feed for now. Users must post in a Circle.
       */}
       {/* <CreateVent circleId="" onPosted={fetchVents} /> */}
       <div className="bg-muted p-4 rounded-lg mb-6 text-center text-sm text-muted-foreground">
         To share your thoughts, join a Circle that matches your topic.
       </div>

      <div className="space-y-4">
        {vents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
                <p>The void is silent.</p>
            </div>
        ) : (
            vents.map(vent => (
                <VentCard key={vent.id} vent={vent} onReact={handleReact} />
            ))
        )}
      </div>
    </div>
  )
}

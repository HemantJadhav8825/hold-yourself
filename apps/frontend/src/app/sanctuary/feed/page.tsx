"use client"

import { useEffect, useState, useCallback } from "react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import client from "@/api/client"
import { VentCard, Vent } from "@/components/sanctuary/vent-card"
import { CreateVent } from "@/components/sanctuary/create-vent"
import { Button } from "@/components/ui/Button"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { markSanctuaryInteraction, hasRecentlyInteracted } from "@/lib/sanctuary-suppression"
import { SanctuaryFeedAffordance } from "@/components/sanctuary/feed-affordance"

export default function GlobalFeedPage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  
  const [vents, setVents] = useState<Vent[]>([])
  const [loading, setLoading] = useState(true)
  const [suppressed, setSuppressed] = useState(true)

  const fetchVents = useCallback(async () => {
    try {
        // Fetch global feed (no circle filter)
        const res = await client.get('/v1/vents')
        setVents(res.data)
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVents()
    setSuppressed(hasRecentlyInteracted())
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
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground text-xs" onClick={() => router.push('/sanctuary')}>
          <ArrowLeft className="mr-2 h-3 w-3" /> Sanctuary Home
        </Button>
        <Button variant="link" className="text-muted-foreground hover:text-foreground text-xs" onClick={() => {
            markSanctuaryInteraction();
            router.push('/dashboard');
        }}>
          Return to We belong
        </Button>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
            The Void
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">A temporary archive of thoughts.</p>
      </div>

       <div className="border border-dashed border-border p-4 rounded-lg mb-8 text-center text-xs text-muted-foreground">
         Speak your truth. Thoughts here are not held.
       </div>

       {!suppressed && <SanctuaryFeedAffordance />}

      <div className="space-y-6 mb-12">
        {vents.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground/60 italic text-sm">
                <p>The void is silent.</p>
            </div>
        ) : (
            vents.map(vent => (
                <VentCard key={vent.id} vent={vent} onReact={handleReact} />
            ))
        )}
      </div>

      <div className="pt-12 border-t border-border flex flex-col items-center gap-6 text-center">
        <p className="text-xs text-muted-foreground italic">
            &quot;Vents disappear after 24h. Your release is temporary.&quot;
        </p>
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">You&apos;re not alone. This will pass. You still belong.</p>
            <Button variant="outline" className="text-xs" onClick={() => {
                markSanctuaryInteraction();
                router.push('/dashboard');
            }}>
                Close Sanctuary
            </Button>
        </div>
      </div>
    </div>
  )
}

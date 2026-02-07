"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import client from "@/api/client"
import { VentCard, Vent } from "@/components/sanctuary/vent-card"
import { CreateVent } from "@/components/sanctuary/create-vent"
import { Button } from "@/components/ui/Button"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CircleDetailsPage() {
  const params = useParams()
  const circleId = params?.id as string
  const router = useRouter()
  const { user } = useCurrentUser()
  
  const [vents, setVents] = useState<Vent[]>([])
  const [loading, setLoading] = useState(true)
  const [circleName, setCircleName] = useState("")

  const fetchVents = useCallback(async () => {
    try {
        const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
        
        // Fetch circle details first for the header
        const circleRes = await client.get(`${chatApiUrl}/v1/circles/${circleId}`)
        setCircleName(circleRes.data.name)

        // Fetch feed
        const res = await client.get(`${chatApiUrl}/v1/vents?circle=${circleId}`)
        setVents(res.data)
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }
  }, [circleId])

  useEffect(() => {
    if (circleId) {
        fetchVents()
    }
  }, [circleId, fetchVents])

  const handleReact = async (ventId: string, emoji: string) => {
    try {
        const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
        await client.post(`${chatApiUrl}/v1/vents/${ventId}/react`, { emoji, userId: user?.id })
        // Optimistic update or refetch
        fetchVents()
    } catch (error) {
        console.error("Failed to react", error)
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" className="mb-4 pl-0" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
            {circleName || 'Circle'}
        </h1>
        <p className="text-muted-foreground">This is a safe space. Anything you post here will disappear in 24 hours.</p>
      </div>

      <CreateVent circleId={circleId} onPosted={fetchVents} />

      <div className="space-y-4">
        {vents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
                <p>It's quiet here. Be the first to share.</p>
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

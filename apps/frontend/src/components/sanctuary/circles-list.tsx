"use client"

import { useEffect, useState } from "react"
import { CircleCard } from "@/components/sanctuary/circle-card"
import type { Circle } from "@/components/sanctuary/circle-card"
import { Loader2 } from "lucide-react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import client from "@/api/client"
import { toast } from "sonner"

export default function CirclesList() {
  const { user } = useCurrentUser()
  const [circles, setCircles] = useState<Circle[]>([])
  const [loading, setLoading] = useState(true)
  const [myCircles, setMyCircles] = useState<string[]>([])

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
        
        // Fetch all circles (or popular ones)
        const res = await client.get(`${chatApiUrl}/v1/circles`)
        setCircles(res.data)

        // Fetch user's circles to show joined status
        if (user) {
           try {
             const myRes = await client.get(`${chatApiUrl}/v1/circles/my?userId=${user.id}`)
             setMyCircles(myRes.data.map((c: Circle) => c.id))
           } catch (e) {
             console.error("Failed to fetch my circles", e)
           }
        }

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCircles()
  }, [user])

  const handleJoin = async (circleId: string) => {
    try {
        const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
        await client.post(`${chatApiUrl}/v1/circles/${circleId}/join`, { userId: user?.id })
        
        setMyCircles(prev => [...prev, circleId])
        toast.success("Joined circle successfully")
    } catch (error) {
        toast.error("Failed to join circle")
    }
  }

  const handleLeave = async (circleId: string) => {
    try {
        const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
        await client.post(`${chatApiUrl}/v1/circles/${circleId}/leave`, { userId: user?.id })
        
        setMyCircles(prev => prev.filter(id => id !== circleId))
        toast.success("Left circle")
    } catch (error) {
        toast.error("Failed to leave circle")
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {circles.map(circle => (
        <CircleCard 
          key={circle.id} 
          circle={circle as any} 
          isJoined={myCircles.includes(circle.id)}
          onJoin={handleJoin}
          onLeave={handleLeave}
        />
      ))}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import client from "@/api/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Loader2, Send } from "lucide-react"

interface CreateVentProps {
  circleId: string
  onPosted: () => void
}

export function CreateVent({ circleId, onPosted }: CreateVentProps) {
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("neutral")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
      await client.post(`${chatApiUrl}/v1/vents`, {
          circle: circleId,
          content,
          mood
      })

      setContent("")
      setMood("neutral")
      onPosted()
    } catch (error) {
      console.error(error)
      // toast error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6 border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Vent into the void</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="What's weighing on you? (Disappears in 24h)" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none"
          rows={3}
        />
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="neutral">😐 Neutral</SelectItem>
                    <SelectItem value="sad">😔 Sad</SelectItem>
                    <SelectItem value="anxious">😰 Anxious</SelectItem>
                    <SelectItem value="angry">😠 Angry</SelectItem>
                    <SelectItem value="hopeful">🙂 Hopeful</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <Button onClick={handleSubmit} disabled={loading || !content.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          Post
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import client from "@/api/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Loader2, Send } from "lucide-react"
import { markSanctuaryInteraction } from "@/lib/sanctuary-suppression"

interface CreateVentProps {
  circleId: string
  onPosted: () => void
}

export function CreateVent({ circleId, onPosted }: CreateVentProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const chatApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3200'
      await client.post(`${chatApiUrl}/v1/vents`, {
          circle: circleId,
          content,
          mood: 'neutral' // Default to neutral
      })

      setContent("")
      markSanctuaryInteraction()
      onPosted()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6 border-dashed bg-card shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Vent into the void</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="Share it safely. It won&apos;t stay." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none bg-muted/20 border-border focus-visible:ring-muted-foreground"
          rows={3}
        />
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSubmit} 
          disabled={loading || !content.trim()}
          className="text-xs h-8"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Send className="h-3 w-3 mr-2" />}
          Release
        </Button>
      </CardFooter>
    </Card>
  )
}

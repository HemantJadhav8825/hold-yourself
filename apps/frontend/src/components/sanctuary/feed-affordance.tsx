"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { MessageSquarePlus } from "lucide-react"

export function SanctuaryFeedAffordance() {
  const router = useRouter()

  return (
    <div 
      onClick={() => router.push('/sanctuary/feed/new')}
      className="group mb-8 cursor-pointer rounded-xl border border-dashed border-border/60 bg-muted/5 p-6 transition-all hover:bg-muted/10 hover:border-border"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/20 text-muted-foreground transition-colors group-hover:bg-primary/5 group-hover:text-primary/70">
          <MessageSquarePlus className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            Release a thought
          </p>
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-tighter">
            This will disappear after 24 hours
          </p>
        </div>
      </div>
    </div>
  )
}

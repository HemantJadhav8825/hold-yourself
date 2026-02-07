"use client"

import { env } from "@/config/env"
import { notFound } from "next/navigation"
import { useEffect } from "react"
import { markSanctuarySessionActive } from "@/lib/sanctuary-suppression"

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check feature flag
  const isEnabled = env.NEXT_PUBLIC_SANCTUARY_ENABLED === 'true'

  useEffect(() => {
    if (isEnabled) {
      markSanctuarySessionActive();
    }
  }, [isEnabled]);

  if (!isEnabled) {
    notFound()
  }

  return <>{children}</>
}

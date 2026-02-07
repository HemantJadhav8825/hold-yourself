"use client"

import { env } from "@/config/env"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [enabled, setEnabled] = useState(true) // Default to true to avoid flash, but check env immediately

  // Check feature flag
  const isEnabled = env.NEXT_PUBLIC_SANCTUARY_ENABLED === 'true'

  if (!isEnabled) {
    notFound()
  }

  return <>{children}</>
}

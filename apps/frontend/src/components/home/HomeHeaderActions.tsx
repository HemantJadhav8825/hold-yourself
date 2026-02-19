"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

import { Button } from "@/components/ui/Button"
import { PaperToggle } from "@/components/ui/PaperToggle"

export function HomeHeaderActions() {
  const { isAuthenticated, isLoading } = useAuth()

  // Avoid flicker or layout shift: render placeholders or same-size buttons while loading
  // For simplicity here, we stick to the main "Log In / Get Started" flow if loading,
  // or return null to avoid flash of wrong state.
  // Returning null might cause hydration mismatch if not handled carefully,
  // but this is a client component, so it renders on client.
  if (isLoading) {
    return (
      <>
        <PaperToggle />
        <Button variant="ghost" size="sm" disabled>
          Log in
        </Button>
        <Button size="sm" disabled>Enter</Button>
      </>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <PaperToggle />
        <Link href="/">
          <Button size="sm" variant="default">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <PaperToggle />
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Enter</Button>
        </Link>
      </div>
    </>
  )
}

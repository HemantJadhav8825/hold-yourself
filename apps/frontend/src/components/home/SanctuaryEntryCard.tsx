"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

export function SanctuaryEntryCard() {
  const router = useRouter()

  return (
    <section className="mb-16">
      <Card className="max-w-md mx-auto bg-webelong-card border border-webelong-border shadow-sm hover:shadow-md transition-shadow duration-500">
        <CardContent className="p-8 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-foreground/80">
              A space that’s open to you.
            </h2>
            <p className="text-muted-foreground text-sm">
              Anonymous. No pressure.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto font-normal rounded-full px-8"
              onClick={() => router.push('/login')}
              data-testid="sanctuary-release-btn"
            >
              Enter, if you want
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

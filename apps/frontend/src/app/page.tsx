import Link from "next/link"
import { ArrivalHeader } from "@/components/home/ArrivalHeader"
import { SanctuaryEntryCard } from "@/components/home/SanctuaryEntryCard"
import { QuietFooter } from "@/components/home/QuietFooter"
import { Container } from "@/components/ui/Container"
import { ThemeToggle } from "@/components/theme-toggle"
import { HomeHeaderActions } from "@/components/home/HomeHeaderActions"
import { brand } from "@/config/brand"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Global Navigation (kept for utility) */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-14 items-center justify-between">
          <div className="font-heading text-lg font-bold tracking-tight text-foreground/80">
            {brand.PRODUCT_NAME}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <HomeHeaderActions />
          </div>
        </Container>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        <Container className="max-w-2xl">
          <ArrivalHeader />
          <SanctuaryEntryCard />
        </Container>
      </main>

      <QuietFooter />
    </div>
  )
}

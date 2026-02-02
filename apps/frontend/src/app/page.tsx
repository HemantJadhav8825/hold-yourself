import Link from "next/link"
import { ArrowRight, Brain, Shield, Sparkles } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Container } from "@/components/ui/Container"
import { Section } from "@/components/ui/Section"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/Button" // Kept for Manifesto button
import { HomeHeaderActions } from "@/components/home/HomeHeaderActions"
import { HeroActions } from "@/components/home/HeroActions"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
          <div className="font-heading text-xl font-bold tracking-tight text-primary">
            Hold Yourself
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <HomeHeaderActions />
          </div>
        </Container>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <Section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <Container className="flex flex-col items-center text-center">
            <div className="mb-8 inline-flex animate-fade-in items-center rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="font-medium">Self-mastery begins here</span>
            </div>
            <h1 className="mb-6 max-w-4xl font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Clarity, Focus, and <br className="hidden sm:inline" />
              <span className="text-primary">True Accountability</span>
            </h1>
            <p className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A calm, distraction-free space to track your growth, build habits,
              and connect with your better self. No noise, just progress.
            </p>
            <HeroActions />
          </Container>
        </Section>

        {/* Core Features */}
        <Section id="features" className="bg-muted/30">
          <Container>
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Designed for Peace of Mind
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Tools that help you stay grounded without the overwhelm of
                traditional productivity apps.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={Brain}
                title="Clarity & Focus"
                description="Daily reflections and guided sessions to help you clear the mental clutter."
              />
              <FeatureCard
                icon={Shield}
                title="Private by Default"
                description="Your data is yours. End-to-end encryption ensures your thoughts stay private."
              />
              <FeatureCard
                icon={Sparkles}
                title="Habit Formation"
                description="Gentle reminders and streaks to help you build sustainable positive habits."
              />
            </div>
          </Container>
        </Section>

        {/* How It Works */}
        <Section>
          <Container>
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Simple by Design
              </h2>
            </div>
            <div className="grid gap-12 md:grid-cols-3">
              <Step
                number="01"
                title="Check In"
                description="Take 2 minutes daily to log your mood and intentions."
              />
              <Step
                number="02"
                title="Reflect"
                description="Use our guided prompts to process your day and find insights."
              />
              <Step
                number="03"
                title="Grow"
                description="Watch your progress unfold with calm, meaningful analytics."
              />
            </div>
          </Container>
        </Section>

        {/* Trust & Safety */}
        <Section className="bg-primary/5">
          <Container>
            <div className="rounded-3xl bg-card p-8 text-center shadow-sm md:p-12 border">
              <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight">
                Your safe space on the internet
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                We believe in technology that respects your attention and mental
                health. No ads, no dopamine traps, just tools for you.
              </p>
              <Button variant="secondary" size="lg">
                Read our Manifesto
              </Button>
            </div>
          </Container>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold text-primary">
                Hold Yourself
              </span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground">
                Contact
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hold Yourself.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="font-heading">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 text-6xl font-bold text-primary/10 font-heading">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-bold font-heading">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

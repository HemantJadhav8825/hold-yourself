import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { QuietFooter } from '@/components/home/QuietFooter'
import { emotions } from '@/lib/emotions'

export const metadata: Metadata = {
    title: 'Human emotions — Webelong',
    description: 'Explore emotional states and find safe presence. A centralized hub for understanding and validating how you feel.',
    openGraph: {
        title: 'Human emotions — Webelong',
        description: 'Explore emotional states and find safe presence.',
    },
}

export default function EmotionsHubPage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 py-20">
                <Container className="max-w-2xl space-y-16">
                    <section className="space-y-6 text-center">
                        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                            Explore what you feel.
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Every emotion is a valid part of the human journey.
                        </p>
                    </section>

                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {emotions.map((emotion) => (
                            <Link
                                key={emotion}
                                href={`/i-feel-${emotion}`}
                                className="group p-6 rounded-2xl border border-primary/10 bg-primary/5 transition-all hover:bg-primary/10 hover:border-primary/20 hover:scale-[1.02]"
                            >
                                <h2 className="text-xl font-medium capitalize group-hover:text-primary transition-colors">
                                    I feel {emotion}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    A safe space for when you feel {emotion}.
                                </p>
                            </Link>
                        ))}
                    </section>

                    <div className="flex justify-center pt-8 border-t border-border/50">
                        <Link
                            href="/"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Return Home
                        </Link>
                    </div>
                </Container>
            </main>

            <QuietFooter />
        </div>
    )
}

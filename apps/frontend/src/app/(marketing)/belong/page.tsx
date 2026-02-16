import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { QuietFooter } from '@/components/home/QuietFooter'
import { emotions } from '@/lib/emotions'

export const metadata: Metadata = {
    title: 'You Deserve to Belong | Webelong',
    description: 'Webelong is an anonymous emotional support network. A safe space where you can share your feelings and carry each other through tough times.',
    openGraph: {
        title: 'You Deserve to Belong | Webelong',
        description: 'Webelong is an anonymous emotional support network. A safe space where you can share your feelings and carry each other through tough times.',
    },
}

export default function BelongPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is Webelong?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Webelong is an anonymous emotional support network designed to help people connect through shared feelings and experiences.',
                },
            },
            {
                '@type': 'Question',
                name: 'Is Webelong anonymous?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, Webelong is completely anonymous. You can share your thoughts without revealing your identity.',
                },
            },
            {
                '@type': 'Question',
                name: 'Is Webelong safe?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, we prioritize safety and kindness. Our community guidelines ensure a supportive environment for everyone.',
                },
            },
        ],
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="flex-1 py-20">
                <Container className="max-w-2xl space-y-16">
                    <section className="space-y-6 text-center">
                        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                            You deserve to belong. <br />
                            <span className="text-muted-foreground">Even before you speak.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            A quiet place for loud feelings.
                        </p>
                    </section>

                    <section className="space-y-8 prose max-w-none">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">What is Webelong?</h2>
                            <p className="text-lg text-muted-foreground">
                                Webelong is a sanctuary for your thoughts. It is an anonymous space where you can lay down your burdens and find that you are not carrying them alone.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Why Webelong exists</h2>
                            <p className="text-lg text-muted-foreground">
                                We live in a connected world that often feels disconnected. Webelong exists to bridge the gap between isolation and community, providing a space where vulnerability is met with understanding, not judgment.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Who it is for</h2>
                            <p className="text-lg text-muted-foreground">
                                It is for the silent, the seeking, the weary, and the hopeful. If you have ever felt like you were speaking into a void, Webelong is for you.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">How it helps</h2>
                            <p className="text-lg text-muted-foreground">
                                By sharing anonymously, you release the weight of your unspoken words. By reading others, you realize you are part of a larger human experience. We carry each other.
                            </p>
                        </div>

                        <div className="pt-8">
                            <h2 className="text-2xl font-semibold mb-6">Explore how you feel</h2>
                            <div className="flex flex-wrap gap-3">
                                {emotions.map((e) => (
                                    <Link
                                        key={e.emotion}
                                        href={`/i-feel-${e.emotion}`}
                                        className="inline-flex items-center px-4 py-2 rounded-full border border-primary/10 bg-primary/5 text-sm font-medium hover:bg-primary/10 transition-colors"
                                    >
                                        I feel {e.emotion}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-center pt-8">
                        <Link
                            href="/"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Enter Webelong
                        </Link>
                    </div>
                </Container>
            </main>

            <QuietFooter />
        </div>
    )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { QuietFooter } from '@/components/home/QuietFooter'
import { emotions, Emotion } from '@/lib/emotions'

interface Props {
    params: Promise<{ emotion: string }>
}

export async function generateStaticParams() {
    return emotions.map((e) => ({
        emotion: e.emotion,
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { emotion } = await params
    const emotionData = emotions.find(e => e.emotion === emotion)

    if (!emotionData) {
        return {}
    }

    const title = `I feel ${emotion} — You are not alone`
    const description = `If you feel ${emotion}, Webelong is a safe place to exist and express. Connect anonymously with others who understand.`

    return {
        title,
        description,
        alternates: {
            canonical: `/i-feel-${emotion}`,
            languages: {
                "en": `/i-feel-${emotion}`,
            }
        },
        openGraph: {
            title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    }
}

export default async function EmotionPage({ params }: Props) {
    const { emotion } = await params
    const emotionData = emotions.find(e => e.emotion === emotion)

    if (!emotionData) {
        notFound()
    }

    const emotionFormatted = emotion.charAt(0).toUpperCase() + emotion.slice(1)

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `I feel ${emotion}`,
        "url": `https://webelong.world/i-feel-${emotion}`,
        "description": `If you feel ${emotion}, Webelong is a safe place to exist and express.`,
        "dateModified": emotionData.lastReviewed,
        "isPartOf": {
            "@type": "WebSite",
            "name": "Webelong",
            "url": "https://webelong.world"
        }
    }

    const lastReviewedFormatted = new Date(emotionData.lastReviewed).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="flex-1 flex flex-col justify-center py-20">
                <Container className="max-w-2xl text-center space-y-12">
                    <article className="space-y-12">
                        <header className="space-y-6">
                            <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                I feel {emotion}
                            </h1>
                            <div className="h-1 w-24 bg-primary/20 mx-auto rounded-full" />
                        </header>

                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            {/* SECTION A — Emotional validation */}
                            <section className="space-y-4">
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    Feeling {emotion} can be a deeply isolating experience. It is a weight that often feels like it belongs only to you, creating a quiet distance between your inner world and the bustling life outside. In these moments, the world can feel far away, and the simple act of existing can feel like an immense effort. It is okay to be in this space. It is okay to name this feeling.
                                </p>
                            </section>

                            {/* SECTION B — Normalization */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold">You are not alone in this feeling.</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    While the sensation of being {emotion} is unique to you, the experience of it is something many of us carry. It is a natural part of the human spectrum, a signal from our hearts that we are seeking something more, or perhaps just a pause. This state does not mean you are broken, or that you have failed in some way. It is simply where you are right now, and countless others are standing in similar shadows, even if they remain unseen.
                                </p>
                            </section>

                            {/* SECTION C — Silent presence */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-semibold">A place without the need to perform.</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Often, the world asks us to move past our feelings quickly, to put on a face of resilience, or to explain away our heaviness. Here, you do not need to perform. You do not need to justify why you feel {emotion} or provide a timeline for when you will feel differently. This is a space where silent presence is valued just as much as words, and where the simple act of acknowledging your state is enough.
                                </p>
                            </section>

                            {/* SECTION D — Introduce Webelong */}
                            <section className="p-8 rounded-3xl border border-primary/10 bg-primary/5 backdrop-blur-sm space-y-6">
                                <h2 className="text-2xl font-semibold">Why Webelong exists.</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed text-left">
                                    Webelong was built for this exact state of being. We believe that by providing a sanctuary for unspoken thoughts and heavy emotions, we can bridge the gap between isolation and community. It is an anonymous emotional support network where vulnerability is met with understanding rather than judgment. Whether you need to share your burdens or simply read the words of others who understand, this space is kept safe for you to exist exactly as you are.
                                </p>
                            </section>

                            {/* SECTION E — Invitation */}
                            <section className="flex flex-col items-center space-y-6 pt-8">
                                <p className="text-lg text-muted-foreground italic">
                                    We carry each other through the quiet.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-12 text-base font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
                                >
                                    Enter Webelong
                                </Link>
                            </section>

                            <footer className="pt-12 text-xs text-muted-foreground/50">
                                Last reviewed: {lastReviewedFormatted}
                            </footer>
                        </div>
                    </article>
                </Container>
            </main>

            <QuietFooter />
        </div>
    )
}

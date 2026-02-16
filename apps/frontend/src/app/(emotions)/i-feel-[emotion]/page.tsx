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
    return emotions.map((emotion) => ({
        emotion,
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { emotion } = await params

    if (!emotions.includes(emotion as Emotion)) {
        return {}
    }

    const title = `I feel ${emotion} — You are not alone`
    const description = `If you feel ${emotion}, Webelong is a safe place to exist and express. Connect anonymously with others who understand.`

    return {
        title,
        description,
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

    if (!emotions.includes(emotion as Emotion)) {
        notFound()
    }

    const emotionFormatted = emotion.charAt(0).toUpperCase() + emotion.slice(1)

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 flex flex-col justify-center py-20">
                <Container className="max-w-2xl text-center space-y-12">
                    <header className="space-y-6">
                        <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            I feel {emotion}
                        </h1>
                        <div className="h-1 w-24 bg-primary/20 mx-auto rounded-full" />
                    </header>

                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Feeling {emotion} is a heavy weight to carry, but it is a weight shared by many.
                            It doesn&apos;t define who you are, it&apos;s just how you feel right now.
                            And in this moment, you are heard.
                        </p>

                        <div className="p-8 rounded-3xl border border-primary/10 bg-primary/5 backdrop-blur-sm space-y-4">
                            <h2 className="text-xl font-semibold">You don&apos;t have to carry this alone.</h2>
                            <p className="text-muted-foreground">
                                Webelong is a sanctuary for your unspoken thoughts.
                                A place where your feelings are normalized, not judged.
                            </p>
                        </div>

                        <div className="flex justify-center pt-8">
                            <Link
                                href="/"
                                className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-medium text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
                            >
                                Enter Webelong
                            </Link>
                        </div>
                    </div>
                </Container>
            </main>

            <QuietFooter />
        </div>
    )
}

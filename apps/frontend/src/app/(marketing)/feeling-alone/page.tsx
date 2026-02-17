import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { QuietFooter } from '@/components/home/QuietFooter'

export const metadata: Metadata = {
    title: 'If You Feel Alone, You Are Not Broken | Webelong',
    description: 'Feeling alone is a human experience. At Webelong, we believe in the power of shared silence and connection. You are not alone here.',
    openGraph: {
        title: 'If You Feel Alone, You Are Not Broken | Webelong',
        description: 'Feeling alone is a human experience. At Webelong, we believe in the power of shared silence and connection. You are not alone here.',
    },
}

export default function FeelingAlonePage() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 py-20">
                <Container className="max-w-2xl space-y-16">
                    <section className="space-y-6 text-center">
                        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                            If you feel alone, you are not broken.
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Loneliness is not a flaw. It is a signal.
                        </p>
                    </section>

                    <section className="space-y-8 prose max-w-none">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Feeling alone is human</h2>
                            <p className="text-lg text-muted-foreground">
                                Everyone feels alone at some point. It is a natural response to the world we live in. Your feelings are valid, and they do not define your worth.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">You are not weak</h2>
                            <p className="text-lg text-muted-foreground">
                                Admitting you feel alone takes courage. It is the first step towards connection. Strength isn&apos;t about never needing anyone; it&apos;s about being brave enough to reach out.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">A safe space exists</h2>
                            <p className="text-lg text-muted-foreground">
                                Webelong is built to be that safe harbor. A place where you can be yourself without fear of judgment. Here, you don&apos;t have to perform or pretend. You just have to be.
                            </p>
                        </div>

                        <div className="bg-muted/50 p-6 rounded-lg text-center border border-border/50">
                            <p className="text-lg font-medium">
                                &quot;We are all just walking each other home.&quot;
                            </p>
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

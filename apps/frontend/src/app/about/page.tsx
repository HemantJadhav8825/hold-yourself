import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About',
    description:
        'Webelong is a belonging-first social platform designed for emotional safety, honest expression, and human connection.',
    alternates: {
        canonical: '/about',
    },
}

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <header className="mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    We exist to make the internet safer for feelings.
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                    Webelong is a reaction to a world that demands performance. We are building a sanctuary for the parts of you that don&apos;t need to be optimized.
                </p>
            </header>

            <div className="space-y-16">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground/90">The Problem</h2>
                    <div className="prose prose-lg">
                        <p>
                            Somewhere along the way, the internet became a stage. Every post became a performance. Every feeling became content. The metric for human connection became &quot;engagement,&quot; and in the process, we lost the safety to just be.
                        </p>
                        <p>
                            We believe this performance is exhausting us. It&apos;s creating a loneliness epidemic disguised as hyper-connectivity.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Our Philosophy</h2>
                    <div className="prose prose-lg">
                        <p>
                            <strong>Belonging before performing.</strong><br />
                            We don&apos;t have public like counts. We don&apos;t have algorithmic feeds designed to addict you. We measure success by how safe you feel, not how long you stay.
                        </p>
                        <p>
                            <strong>Feelings are not content.</strong><br />
                            Your vulnerability is not a commodity to be mined for ad revenue. It is a human experience to be honored.
                        </p>
                        <p>
                            <strong>Permanence and Safety.</strong><br />
                            We are building Webelong to last. Not to flip, not to exit, but to exist as a reliable utility for emotional health. This is a long-term project for the human spirit.
                        </p>
                    </div>
                </section>

                <section className="bg-muted/30 p-8 rounded-xl border border-border/50">
                    <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
                    <div className="prose prose-lg">
                        <p>
                            We will protect your data. We will protect your peace. We will never sell your emotional life to the highest bidder.
                        </p>
                        <p className="font-medium text-foreground">
                            You belong here. Exactly as you are.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact',
    description:
        'We are here to listen. Contact real humans at Webelong.',
    alternates: {
        canonical: '/contact',
    },
}

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <header className="mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-6">
                    We are real people.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Webelong is built and run by humans who care deeply about this mission. You are not shouting into a void. We read every message.
                </p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="p-8 rounded-xl bg-card border border-border shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Support & Care</h2>
                    <p className="text-muted-foreground mb-6">
                        If you are experiencing issues, have safety concerns, or just need help navigating the platform.
                    </p>
                    <a
                        href="mailto:support@webelong.world"
                        className="inline-flex items-center text-primary font-medium hover:underline text-lg"
                    >
                        support@webelong.world
                    </a>
                </div>

                <div className="p-8 rounded-xl bg-muted/30 border border-border/50">
                    <h2 className="text-xl font-semibold mb-4">Thoughts & Feedback</h2>
                    <p className="text-muted-foreground mb-6">
                        We are building this for you. Your feedback shapes the future of this sanctuary. Tell us what you need.
                    </p>
                    <a
                        href="mailto:hello@webelong.world"
                        className="inline-flex items-center text-foreground/80 font-medium hover:text-foreground hover:underline text-lg"
                    >
                        hello@webelong.world
                    </a>
                </div>
            </div>

            <div className="mt-16 text-center">
                <p className="text-muted-foreground">
                    We try to respond to all inquiries within 24 hours. Thank you for being here.
                </p>
            </div>
        </div>
    )
}

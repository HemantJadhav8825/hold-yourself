import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description:
        'Our contract with you. Webelong is a community of shared safety and respect.',
    alternates: {
        canonical: '/terms',
    },
}

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <header className="mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-6">
                    Community Agreements.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    These are not just legal requirements. They are the boundaries that make this space safe for everyone. By being here, you agree to uphold them.
                </p>
            </header>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. The Golden Rule of Safety</h2>
                    <div className="prose prose-lg">
                        <p>
                            Webelong exists for emotional safety. Any behavior that threatens the safety, dignity, or well-being of another member is grounds for immediate removal. We prioritize the safety of the community over the presence of any single individual.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Zero Tolerance</h2>
                    <div className="prose prose-lg">
                        <p>
                            We have zero tolerance for hate speech, harassment, bullying, or predation. We are building a sanctuary, and we protect it vigorously.
                        </p>
                        <p>
                            If you see something that violates this spirit, please report it. You are helping us build the internet we all deserve.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Content Ownership</h2>
                    <div className="prose prose-lg">
                        <p>
                            You own your words. You own your feelings. We claim no ownership over the content you post on Webelong. You grant us only the permission necessary to display it to the community.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">4. Mental Health Context</h2>
                    <div className="prose prose-lg">
                        <p>
                            Webelong is a peer support community, not a clinical service. We are here to walk with you, but we cannot replace professional medical care. In a crisis, please contact emergency services or a crisis helpline immediately.
                        </p>
                    </div>
                </section>

                <footer className="pt-8 border-t border-border">
                    <p className="text-muted-foreground italic">
                        Thank you for helping us keep this space safe. Last updated February 2026.
                    </p>
                </footer>
            </div>
        </div>
    )
}

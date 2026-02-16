import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        'Your emotional safety is our priority. Learn how Webelong protects your data and privacy.',
    alternates: {
        canonical: '/privacy',
    },
}

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-3xl">
            <header className="mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-6">
                    Privacy is the foundation of emotional safety.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    We cannot ask you to be vulnerable if we are not safe. Here is exactly how we treat your data, your presence, and your trust.
                </p>
            </header>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Human-First Summary</h2>
                    <div className="prose prose-lg">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>We do <strong>not</strong> sell your data. Ever.</li>
                            <li>We minimize what we collect. If we don&apos;t need it, we don&apos;t want it.</li>
                            <li>You own your content. You can delete it at any time.</li>
                            <li>Our business model is not surveillance. It is service.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Data Minimization</h2>
                    <div className="prose prose-lg">
                        <p>
                            We practice aggressive data minimization. We only collect the absolute minimum required to create your account and enable the features you use. We do not track your activity across other websites.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Emotional Data Protection</h2>
                    <div className="prose prose-lg">
                        <p>
                            The thoughts and feelings you share on Webelong are sensitive. We treat them as such. They are stored securely and are never used for advertising profiling. Your vulnerability is safe here.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Deletion Rights</h2>
                    <div className="prose prose-lg">
                        <p>
                            You have the absolute right to be forgotten. If you choose to leave Webelong, you can permanently delete your account and all associated data. We do not hold onto &quot;shadow copies&quot; of your information.
                        </p>
                    </div>
                </section>

                <footer className="pt-8 border-t border-border">
                    <p className="text-muted-foreground italic">
                        This policy was last updated on February 2026. Stability and trust are our currencies.
                    </p>
                </footer>
            </div>
        </div>
    )
}

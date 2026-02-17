import { Container } from '@/components/ui/Container';
import { PublicFeed } from '@/features/holding-space/components/PublicFeed';
import { Metadata } from 'next';
import { QuietFooter } from '@/components/home/QuietFooter';

export const metadata: Metadata = {
    title: 'Holding Space — Webelong',
    description: 'A quiet place to exist and express safely. Browse thoughts from the community without pressure to perform.',
};

export default function HoldingSpaceFeedPage() {
    return (
        <div className="min-h-screen bg-background py-20">
            <Container className="max-w-2xl space-y-12">
                <header className="space-y-6 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
                        Holding Space
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        A stream of consciousness from people just like you.
                        No algorithms, no metrics, just presence.
                    </p>
                </header>

                <div className="w-full">
                    <PublicFeed />
                </div>
            </Container>

            <QuietFooter />
        </div>
    );
}

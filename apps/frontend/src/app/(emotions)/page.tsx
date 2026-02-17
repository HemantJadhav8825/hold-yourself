import { emotions } from '@/lib/emotions';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Explore Feelings — Webelong',
    description: 'A directory of emotions and states of being. You are not alone in how you feel.',
};

export default function EmotionsIndexPage() {
    return (
        <div className="min-h-screen bg-background py-20">
            <Container className="max-w-4xl space-y-12">
                <header className="space-y-6 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
                        Explore Feelings
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A collection of spaces for every shade of the human experience.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {emotions.map((emotion) => (
                        <Link
                            key={emotion.emotion}
                            href={`/i-feel-${emotion.emotion}`}
                            className="group block"
                        >
                            <article className="h-full p-8 rounded-3xl bg-card border border-border/40 hover:border-primary/20 hover:bg-muted/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                                <h2 className="text-2xl font-serif font-medium mb-3 capitalize group-hover:text-primary transition-colors">
                                    I feel {emotion.emotion}
                                </h2>
                                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                    If you feel {emotion.emotion}, you belong here.
                                </p>
                            </article>
                        </Link>
                    ))}
                </div>

                <div className="pt-12 text-center text-muted-foreground italic text-sm">
                    More feelings will be given space soon.
                </div>

                <div className="flex justify-center pt-8">
                    <Link
                        href="/"
                        className="text-primary hover:underline underline-offset-4"
                    >
                        Return Home
                    </Link>
                </div>
            </Container>
        </div>
    );
}

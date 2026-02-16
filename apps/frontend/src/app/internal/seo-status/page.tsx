import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { emotionRankTrackingData } from '@/lib/emotionRankTracker'

export const metadata = {
    title: 'SEO Status Dashboard | Internal',
    robots: 'noindex, nofollow',
}

export default function SEOStatusPage() {
    return (
        <div className="min-h-screen bg-background py-20">
            <Container>
                <div className="space-y-8">
                    <div className="flex items-center justify-between border-b pb-6">
                        <h1 className="text-3xl font-bold">SEO Status Dashboard</h1>
                        <div className="flex gap-4">
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">
                                10 Pages Tracked
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 text-muted-foreground text-sm">
                                    <th className="py-4 font-medium">Emotion</th>
                                    <th className="py-4 font-medium">Target Keyword</th>
                                    <th className="py-4 font-medium">URL Path</th>
                                    <th className="py-4 font-medium">Submission Status</th>
                                    <th className="py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {emotionRankTrackingData.map((item) => (
                                    <tr key={item.emotion} className="group hover:bg-muted/30 transition-colors">
                                        <td className="py-4 capitalize font-medium">{item.emotion}</td>
                                        <td className="py-4 text-muted-foreground italic">&quot;{item.targetKeyword}&quot;</td>
                                        <td className="py-4">
                                            <code className="text-xs bg-muted px-2 py-1 rounded">{item.url}</code>
                                        </td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-amber-500">
                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                Ready for GSC
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <Link
                                                href={item.url}
                                                target="_blank"
                                                className="text-xs text-primary hover:underline"
                                            >
                                                Preview Page
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 space-y-4">
                        <h2 className="text-lg font-semibold">Indexing Manifests</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/emotion-sitemap.xml" className="p-4 bg-background rounded-xl border hover:border-primary/30 transition-colors flex items-center justify-between">
                                <span>XML Sitemap</span>
                                <span className="text-xs text-muted-foreground">/emotion-sitemap.xml</span>
                            </Link>
                            <Link href="/request-indexing-list.txt" className="p-4 bg-background rounded-xl border hover:border-primary/30 transition-colors flex items-center justify-between">
                                <span>Plain Text List</span>
                                <span className="text-xs text-muted-foreground">/request-indexing-list.txt</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

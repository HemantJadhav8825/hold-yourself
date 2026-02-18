"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

const emotions = [
    { label: "Feeling alone", href: "/i-feel-alone" },
    { label: "Feeling lost", href: "/i-feel-lost" }, // Assuming this route exists or will exist, otherwise falling back to feeling-lost pattern if needed. For now sticking to explicit requests or common patterns.
    { label: "Feeling overwhelmed", href: "/i-feel-overwhelmed" },
    { label: "Explore all feelings", href: "/emotions", variant: "primary" },
]

export function DiscoveryHub() {
    return (
        <section className="py-24 text-center space-y-10 border-t border-border/40">
            <div className="space-y-4">
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">
                    You’re not the only one feeling this way.
                </h2>
                <p className="text-muted-foreground text-lg">
                    People come here carrying many different feelings.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {emotions.map((emotion) => (
                    <Link
                        key={emotion.href}
                        href={emotion.href}
                        className={cn(
                            "px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium",
                            emotion.variant === "primary"
                                ? "bg-foreground text-background hover:bg-foreground/90 border border-transparent"
                                : "bg-background text-foreground/80 border border-border hover:border-foreground/30 hover:bg-muted/50"
                        )}
                    >
                        {emotion.label}
                    </Link>
                ))}
            </div>
        </section>
    )
}

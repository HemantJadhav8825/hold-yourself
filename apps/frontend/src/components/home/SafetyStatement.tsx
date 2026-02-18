"use client"

export function SafetyStatement() {
    return (
        <section className="py-24 text-center max-w-2xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                You don’t have to perform here.
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                    Webelong doesn’t show likes, follower counts, or popularity.
                </p>
                <p>
                    There’s no pressure to be interesting.
                </p>
                <p>
                    There’s no pressure to be anything.
                </p>
                <div className="pt-4 space-y-2 font-medium text-foreground/80">
                    <p>You can be anonymous.</p>
                    <p>You can be quiet.</p>
                    <p>You can simply exist here.</p>
                </div>
            </div>
        </section>
    )
}

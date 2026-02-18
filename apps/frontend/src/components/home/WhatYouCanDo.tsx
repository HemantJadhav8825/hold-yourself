"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function WhatYouCanDo() {
    return (
        <section className="py-24 space-y-16">
            <div className="text-center space-y-4">
                <h2 className="font-serif text-3xl text-foreground">
                    What you can do here
                </h2>
                <div className="text-muted-foreground space-y-1">
                    <p>There’s no right way to be here.</p>
                    <p>But if you’d like, you can:</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Share */}
                <Card className="bg-webelong-card border-webelong-border flex flex-col items-center text-center p-6 h-full hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="space-y-4 pb-2">
                        <CardTitle className="font-serif text-xl">Share what’s on your mind</CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed">
                            You can write something you’ve been carrying.
                            <br />
                            No expectations. No performance.
                            <br />
                            Just expression.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-6">
                        <Button asChild variant="outline" className="rounded-full group">
                            <Link href="/holding-space">
                                Holding Space
                                <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Card 2: See */}
                <Card className="bg-webelong-card border-webelong-border flex flex-col items-center text-center p-6 h-full hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="space-y-4 pb-2">
                        <CardTitle className="font-serif text-xl">See how others feel</CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed">
                            You might find words you couldn’t say yourself.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-6">
                        <Button asChild variant="outline" className="rounded-full group">
                            <Link href="/emotions">
                                Explore Feelings
                                <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Card 3: Respond */}
                <Card className="bg-webelong-card border-webelong-border flex flex-col items-center text-center p-6 h-full hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="space-y-4 pb-2">
                        <CardTitle className="font-serif text-xl">Respond with presence</CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed">
                            Sometimes being heard matters.
                            <br />
                            Sometimes hearing someone else matters too.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto pt-6">
                        <Button asChild variant="default" className="rounded-full bg-foreground text-background hover:bg-foreground/90 group">
                            <Link href="/holding-space">
                                Enter Holding Space
                                <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    )
}

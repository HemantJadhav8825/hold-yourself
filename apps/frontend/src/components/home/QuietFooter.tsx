import { cn } from "@/lib/utils"
import Link from "next/link"

export function QuietFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("py-12 text-center opacity-60 hover:opacity-100 transition-opacity select-none", className)}>
      <div className="w-12 h-px bg-border mx-auto mb-6" />
      <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-6">
        <Link href="/belong" className="hover:text-foreground transition-colors">
          Belonging
        </Link>
        <Link href="/i-feel-alone" className="hover:text-foreground transition-colors">
          Feeling Alone?
        </Link>
        <Link href="/emotions" className="hover:text-foreground transition-colors">
          Explore Feelings
        </Link>
      </div>
      <blockquote className="font-serif italic text-muted-foreground text-sm">
        &quot;Belonging doesn&apos;t ask you to change.&quot;
      </blockquote>
    </footer>
  )
}

import Link from "next/link"
import { Github, Mail, ShieldCheck } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-medium text-foreground">AST Secure CBT</span>
          <span className="text-muted-foreground">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secure
          </span>
          <Link href="#" aria-label="GitHub" className="hover:text-foreground transition-colors">
            <Github className="h-4 w-4" />
          </Link>
          <Link href="#" aria-label="Email" className="hover:text-foreground transition-colors">
            <Mail className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
}



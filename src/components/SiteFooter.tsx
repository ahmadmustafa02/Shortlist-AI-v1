import { Logo } from "./Logo";

export const SiteFooter = () => (
  <footer className="border-t border-border/60 bg-surface">
    <div className="container flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
      <div className="space-y-2">
        <Logo />
        <p className="text-sm text-muted-foreground">Get shortlisted for the job you actually want.</p>
      </div>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ShortlistAI. Crafted with care.</p>
    </div>
  </footer>
);

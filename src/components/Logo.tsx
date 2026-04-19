import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight ${className}`}>
    <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
      <span className="font-display text-lg leading-none">s</span>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary-glow" />
    </span>
    <span>shortlist<span className="text-primary">.ai</span></span>
  </Link>
);

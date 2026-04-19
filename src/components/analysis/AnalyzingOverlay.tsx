import { Sparkles } from "lucide-react";

export const AnalyzingOverlay = ({ open }: { open: boolean }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-elevated">
        <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-primary-soft">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-semibold">Analyzing your fit…</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Comparing your resume against the role, scoring keywords, and writing your prep plan.
          This usually takes 15–30 seconds.
        </p>
        <div className="mt-6 flex justify-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
};

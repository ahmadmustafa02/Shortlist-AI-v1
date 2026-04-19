import { Sparkles, TrendingUp, Target } from "lucide-react";

export const FitScoreSample = () => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-hero blur-2xl" />
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-elevated animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Fit Score</p>
            <p className="mt-1 font-display text-5xl font-semibold text-foreground">87<span className="text-2xl text-muted-foreground">/100</span></p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft">
            <Sparkles className="h-7 w-7 text-primary" strokeWidth={2.2} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary/60 p-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">ATS Before</p>
            <p className="mt-0.5 font-display text-2xl font-semibold">62</p>
          </div>
          <div className="rounded-2xl bg-primary-soft p-3">
            <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-primary">
              ATS After <TrendingUp className="h-3 w-3" />
            </p>
            <p className="mt-0.5 font-display text-2xl font-semibold text-primary">91</p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Target className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground">Missing skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Docker", "Kubernetes", "GraphQL", "AWS Lambda"].map((s) => (
              <span key={s} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

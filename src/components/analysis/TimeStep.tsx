import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TIME_BUDGETS, type TimeBudget } from "@/lib/analysis-schema";
import { cn } from "@/lib/utils";

interface TimeStepProps {
  timeBudget: TimeBudget | null;
  onTimeBudgetChange: (v: TimeBudget) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const TimeStep = ({
  timeBudget,
  onTimeBudgetChange,
  onBack,
  onSubmit,
  isSubmitting,
}: TimeStepProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">How much time do you have?</h2>
        <p className="mt-2 text-muted-foreground">
          Your prep roadmap will be scaled to this — no impossible 6-month plans for a Friday deadline.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TIME_BUDGETS.map((option) => {
          const selected = timeBudget === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onTimeBudgetChange(option.value)}
              className={cn(
                "group relative flex flex-col items-start gap-1 rounded-2xl border-2 bg-card p-5 text-left transition",
                selected
                  ? "border-primary bg-primary-soft shadow-soft"
                  : "border-border hover:border-primary/60 hover:bg-card",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-display text-lg font-semibold">{option.label}</span>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 transition",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background",
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{option.sub}</p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" size="lg" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          onClick={onSubmit}
          size="lg"
          variant="hero"
          disabled={!timeBudget || isSubmitting}
        >
          <Sparkles className="h-4 w-4" />
          {isSubmitting ? "Analyzing…" : "Run analysis"}
        </Button>
      </div>
    </div>
  );
};

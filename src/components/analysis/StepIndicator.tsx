import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: { id: number; label: string }[];
  current: number;
}

export const StepIndicator = ({ steps, current }: StepIndicatorProps) => {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, idx) => {
        const isDone = step.id < current;
        const isActive = step.id === current;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition",
                isDone && "border-primary bg-primary text-primary-foreground",
                isActive && "border-primary bg-primary-soft text-primary",
                !isDone && !isActive && "border-border bg-background text-muted-foreground",
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span
              className={cn(
                "hidden text-sm font-medium sm:inline",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <div className={cn("h-px flex-1", isDone ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
};

import { Briefcase, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { jobInputSchema } from "@/lib/analysis-schema";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface JobStepProps {
  jobTitle: string;
  company: string;
  jdText: string;
  onJobTitleChange: (v: string) => void;
  onCompanyChange: (v: string) => void;
  onJdTextChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const JobStep = ({
  jobTitle,
  company,
  jdText,
  onJobTitleChange,
  onCompanyChange,
  onJdTextChange,
  onBack,
  onNext,
}: JobStepProps) => {
  const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0;
  const charCount = jdText.length;

  const handleNext = () => {
    const result = jobInputSchema.safeParse({ jobTitle, company, jdText });
    if (!result.success) {
      toast({
        title: "Almost there",
        description: result.error.errors[0]?.message ?? "Please check the fields.",
        variant: "destructive",
      });
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">The job you're targeting</h2>
        <p className="mt-2 text-muted-foreground">
          Paste the full job description so we can score the fit and find every gap.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="job-title" className="text-base font-medium">
            Job title <span className="text-primary">*</span>
          </Label>
          <div className="relative">
            <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="job-title"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              placeholder="Senior Backend Engineer"
              maxLength={120}
              className="rounded-xl bg-card pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-base font-medium">
            Company <span className="text-muted-foreground text-sm font-normal">(optional)</span>
          </Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="company"
              value={company}
              onChange={(e) => onCompanyChange(e.target.value)}
              placeholder="Acme Inc."
              maxLength={120}
              className="rounded-xl bg-card pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="jd-text" className="text-base font-medium">
            Job description <span className="text-primary">*</span>
          </Label>
          <span
            className={cn(
              "text-xs",
              charCount >= 80 ? "text-muted-foreground" : "text-warning",
            )}
          >
            {wordCount.toLocaleString()} words · {charCount.toLocaleString()}/20,000
          </span>
        </div>
        <Textarea
          id="jd-text"
          value={jdText}
          onChange={(e) => onJdTextChange(e.target.value.slice(0, 20000))}
          placeholder="Paste the full job posting here — responsibilities, requirements, nice-to-haves, the whole thing. The more we have, the sharper the analysis."
          className="min-h-[320px] resize-y rounded-2xl bg-card text-sm leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          Tip: include the "Requirements" and "Nice to have" sections — that's where the keywords live.
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} size="lg" variant="hero">
          Continue to timeline
        </Button>
      </div>
    </div>
  );
};

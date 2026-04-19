import { FileText, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useResumePdfUpload } from "@/hooks/useResumePdfUpload";
import { cn } from "@/lib/utils";

interface ResumeStepProps {
  resumeText: string;
  onResumeTextChange: (value: string) => void;
  fileName: string | null;
  onFileNameChange: (value: string | null) => void;
  onNext: () => void;
}

export const ResumeStep = ({
  resumeText,
  onResumeTextChange,
  fileName,
  onFileNameChange,
  onNext,
}: ResumeStepProps) => {
  const { isExtracting, isDragging, setIsDragging, inputRef, handleFile, onDrop, maxSizeMb } =
    useResumePdfUpload(onResumeTextChange, onFileNameChange);

  const wordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const canContinue = wordCount >= 40;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-semibold tracking-tight">Add your resume</h2>
        <p className="mt-2 text-muted-foreground">
          Drop a PDF and we'll pull the text out. You can edit anything that comes out wonky.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative rounded-3xl border-2 border-dashed p-8 text-center transition md:p-12",
          isDragging ? "border-primary bg-primary-soft" : "border-border bg-card/60 hover:border-primary/60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />

        {isExtracting ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Reading your PDF…</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">
                {wordCount.toLocaleString()} words extracted
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                Replace PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onFileNameChange(null);
                  onResumeTextChange("");
                }}
              >
                <X className="h-4 w-4" /> Clear
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">Drop your resume PDF here</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse — max {maxSizeMb}MB</p>
            </div>
            <Button onClick={() => inputRef.current?.click()} variant="hero">
              <Upload className="h-4 w-4" /> Choose PDF
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="resume-text" className="text-base font-medium">
            Resume text
          </Label>
          <span className={cn("text-xs", canContinue ? "text-muted-foreground" : "text-warning")}>
            {wordCount.toLocaleString()} words {canContinue ? "" : "· need at least 40"}
          </span>
        </div>
        <Textarea
          id="resume-text"
          value={resumeText}
          onChange={(e) => onResumeTextChange(e.target.value)}
          placeholder="Or paste your resume text here. Fix anything the PDF reader got wrong — names, headings, bullet points, dates."
          className="min-h-[320px] resize-y rounded-2xl bg-card font-mono text-[13px] leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          Tip: keep section headings (Experience, Education, Skills) on their own line for better analysis.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canContinue} size="lg" variant="hero">
          Continue to job description
        </Button>
      </div>
    </div>
  );
};

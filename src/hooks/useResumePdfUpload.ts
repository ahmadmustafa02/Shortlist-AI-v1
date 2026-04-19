import { useCallback, useRef, useState } from "react";
import { extractTextFromPdf } from "@/lib/pdf";
import { toast } from "@/hooks/use-toast";

const MAX_SIZE_MB = 10;

// PDF validation + extract lives here so ResumeStep is mostly layout / copy.
export function useResumePdfUpload(
  onResumeTextChange: (value: string) => void,
  onFileNameChange: (value: string | null) => void,
) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        toast({
          title: "PDF only",
          description: "Please upload a PDF resume, or paste your text below.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Max ${MAX_SIZE_MB}MB. Try compressing or pasting the text instead.`,
          variant: "destructive",
        });
        return;
      }
      setIsExtracting(true);
      try {
        const text = await extractTextFromPdf(file);
        if (!text || text.length < 40) {
          toast({
            title: "Couldn't read much from that PDF",
            description: "It may be a scanned image. Paste your resume text below instead.",
          });
        } else {
          toast({ title: "Resume extracted", description: "Review and edit anything that looks off." });
        }
        onResumeTextChange(text);
        onFileNameChange(file.name);
      } catch (err) {
        console.error(err);
        toast({
          title: "Extraction failed",
          description: "Paste your resume text below to continue.",
          variant: "destructive",
        });
      } finally {
        setIsExtracting(false);
      }
    },
    [onResumeTextChange, onFileNameChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  return {
    isExtracting,
    isDragging,
    setIsDragging,
    inputRef,
    handleFile,
    onDrop,
    maxSizeMb: MAX_SIZE_MB,
  };
}

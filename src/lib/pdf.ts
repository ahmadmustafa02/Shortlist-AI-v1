import * as pdfjsLib from "pdfjs-dist";
// Vite-friendly worker import (?url is handled by Vite at build time)
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Reconstruct lines using y-coordinate buckets so resumes keep structure.
    const lines = new Map<number, { x: number; text: string }[]>();
    for (const item of content.items as Array<{ str: string; transform: number[] }>) {
      if (!item.str) continue;
      const y = Math.round(item.transform[5]);
      const x = item.transform[4];
      if (!lines.has(y)) lines.set(y, []);
      lines.get(y)!.push({ x, text: item.str });
    }
    const sortedY = Array.from(lines.keys()).sort((a, b) => b - a);
    const pageText = sortedY
      .map((y) =>
        lines
          .get(y)!
          .sort((a, b) => a.x - b.x)
          .map((s) => s.text)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim(),
      )
      .filter(Boolean)
      .join("\n");
    pages.push(pageText);
  }

  return pages.join("\n\n").trim();
}

import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function extractTextFromFile(
  buffer: Buffer,
  mimetype: string,
): Promise<string> {
  if (mimetype === "application/pdf") {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const parsed = await parser.getText();
    await parser.destroy();
    return parsed.text.trim();
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value.trim();
  }

  throw new Error(
    "Unsupported file type. Only PDF and DOCX resumes are allowed.",
  );
}

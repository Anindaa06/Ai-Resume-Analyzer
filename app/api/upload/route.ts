import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF and DOCX allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let text = "";

    if (file.type === "application/pdf") {
      // ✅ unpdf handles malformed/bad XRef PDFs gracefully
      const { text: pages } = await extractText(new Uint8Array(buffer), { mergePages: true });
      text = Array.isArray(pages) ? pages.join("\n") : pages;
    } else {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Could not extract text from file. Try a different file." }, { status: 400 });
    }

    return NextResponse.json({ success: true, text });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process file. Please try again." }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { buildPrompt } from "@/lib/analyzePrompt";
import Groq from "groq-sdk";

export const runtime = "nodejs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || resumeText.trim() === "") {
      return NextResponse.json({ error: "Resume text is empty" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: buildPrompt(resumeText, jobDescription || "") }],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const text = completion.choices[0]?.message?.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
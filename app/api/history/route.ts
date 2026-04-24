import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).select("_id").lean();
    if (!user) {
      return NextResponse.json([]);
    }

    const documents = await ResumeAnalysis.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select("filename ats_score createdAt jobDescription")
      .lean();

    const history = documents.map((doc) => ({
      id: String(doc._id),
      filename: doc.filename,
      ats_score: doc.ats_score,
      createdAt: doc.createdAt,
      jobDescription: doc.jobDescription ?? "",
    }));

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load history.",
      },
      { status: 500 },
    );
  }
}

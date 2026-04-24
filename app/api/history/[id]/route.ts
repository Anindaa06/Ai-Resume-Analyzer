import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import User from "@/models/User";

export const runtime = "nodejs";

type RouteContext = {
  params: { id: string };
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysisId = context.params.id;
    if (!Types.ObjectId.isValid(analysisId)) {
      return NextResponse.json({ error: "Invalid history id." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).select("_id").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const analysis = await ResumeAnalysis.findOne({
      _id: analysisId,
      userId: user._id,
    }).lean();

    if (!analysis) {
      return NextResponse.json({ error: "History entry not found." }, { status: 404 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load history entry.",
      },
      { status: 500 },
    );
  }
}

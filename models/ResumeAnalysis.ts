import { Schema, model, models } from "mongoose";

const resumeAnalysisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    filename: { type: String, required: true, trim: true },
    jobTarget: { type: String, trim: true },
    jobDescription: { type: String, trim: true },
    ats_score: { type: Number, required: true, min: 0, max: 100 },
    result: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  },
);

const ResumeAnalysis =
  models.ResumeAnalysis || model("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;

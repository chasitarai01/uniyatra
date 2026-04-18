import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ieltsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 9,
    },
    gradeScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    universityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    testDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TestResult", testResultSchema);
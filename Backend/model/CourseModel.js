import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    CourseName: {
      type: String,
      required: true,
      trim: true,
    },
    UniversityCode: {
      type: String,
      required: true,
      trim: true,
    },
    Country: {
      type: String,
      required: true,
    },
    Overview: {
      type: String,
      required: true,
    },
    Faculty: {
      type: String,
      required: true,
    },
    Level: {
      type: String,
      required: true,
    },
    Mode: {
      type: String,
      required: true,
    },
    StartDate: {
      type: String,
      required: true,
    },
    Duration: {
      type: String,
      required: true,
    },
    TuitionFee: {
      type: String,
      required: true,
    },
    TotalFee: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("courses", courseSchema);

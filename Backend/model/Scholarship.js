import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    scholarshipName: {
      type: String,
      required: true,
      trim: true,
    },
    university: {
      type: String,
      required: true,
      trim: true,
    },
    howToApply: {
      type: String,
      required: true,
    },
    scholarshipValue: {
      type: String,
      required: true,
    },
    noOfAwardsAvailable: {
      type: String, //  change from Number to String
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    criteria: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "scholarship" } // use exact collection name
);

export default mongoose.model("Scholarship", scholarshipSchema);

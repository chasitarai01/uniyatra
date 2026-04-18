import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema(
  {
    University: {
      type: String,
      required: true,
    },

    UniversityCode: {
      type: String,
      required: true,
      unique: true,
    },

    City: {
      type: String,
      required: true,
    },

    Description: {
      type: String,
    },

    InternationalStudentLink: {
      type: String,
    },

    CountryRank: {
      type: Number,
    },

    QSWorldRank: {
      type: Number,
    },

    Logo: {
      type: String, // URL
    },

    Cover: {
      type: String, // URL
    },

    Facebook: {
      type: String,
    },

    Twitter: {
      type: String,
    },

    LinkedIn: {
      type: String,
    },

    Youtube: {
      type: String,
    },

    IntroVideo: {
      type: String, // URL or video link
    },

    Status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    Country: {
      type: String,
    },

    InternationalStudents: {
      type: Number,
    },

    Instagram: {
      type: String,
    },
  },

  { timestamps: true }
);

export default mongoose.model("University", UniversitySchema);

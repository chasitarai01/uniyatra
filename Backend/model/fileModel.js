import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  }
}, { timestamps: true });

const File = mongoose.model("File", imageSchema);
export default File;
import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: true,
  },
});

// prevent duplicate favorites
FavoriteSchema.index({ userId: 1, universityId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema);

export default Favorite;
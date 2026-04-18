import mongoose from "mongoose";

/**
 * Message body is stored only as AES-256-GCM fields (at-rest encryption).
 * Plaintext exists only in memory during encrypt/decrypt and over TLS to clients.
 */
const supportChatMessageSchema = new mongoose.Schema(
  {
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportChatThread",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["student", "admin"],
      required: true,
    },
    ciphertextB64: { type: String, required: true },
    ivB64: { type: String, required: true },
    tagB64: { type: String, required: true },
  },
  { timestamps: true }
);

supportChatMessageSchema.index({ threadId: 1, createdAt: 1 });

export default mongoose.model("SupportChatMessage", supportChatMessageSchema);

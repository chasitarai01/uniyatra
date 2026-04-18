import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // GCM standard nonce size
const AUTH_TAG_LENGTH = 16;

/**
 * Derives a 32-byte key from CHAT_ENCRYPTION_KEY.
 * Use 64 hex chars (256-bit) for production, e.g. `openssl rand -hex 32`.
 */
function getKeyBuffer() {
  const raw = process.env.CHAT_ENCRYPTION_KEY;
  if (!raw || typeof raw !== "string") {
    throw new Error(
      "CHAT_ENCRYPTION_KEY is required (64 hex characters = 256-bit AES key)"
    );
  }
  const trimmed = raw.trim();
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return Buffer.from(trimmed, "hex");
  }
  return crypto.scryptSync(trimmed, "fyp-support-chat-salt", 32);
}

export function encryptMessagePlaintext(plaintext) {
  const key = getKeyBuffer();
  if (key.length !== 32) {
    throw new Error("CHAT_ENCRYPTION_KEY must resolve to 32 bytes");
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const enc = Buffer.concat([
    cipher.update(String(plaintext), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    ciphertextB64: enc.toString("base64"),
    ivB64: iv.toString("base64"),
    tagB64: tag.toString("base64"),
  };
}

export function decryptMessageFields({ ciphertextB64, ivB64, tagB64 }) {
  const key = getKeyBuffer();
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");
  const decipher = crypto.createDecipheriv(ALGO, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}

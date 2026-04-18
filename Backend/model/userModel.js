import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["user", "admin"], default: "user" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

export default mongoose.models.User || mongoose.model('User', userSchema);
 
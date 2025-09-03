import mongoose from "mongoose";

const resetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  token: { type: String, unique: true, index: true },
  // TTL: el doc se borra automáticamente 1h después de createdAt
  createdAt: { type: Date, default: Date.now, expires: 3600 }
});

export default mongoose.model("PasswordReset", resetSchema);

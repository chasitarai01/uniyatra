import mongoose from "mongoose";

const costConfigSchema = new mongoose.Schema({
  country: { type: String, required: true, unique: true },
  currency: { type: String, default: "USD" },
  symbol: { type: String, default: "$" },
  rates: {
    tuition: { type: Number, default: 0 },
    living: { type: Number, default: 0 },
    visa: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    flights: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 }
  },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("CostConfig", costConfigSchema);

import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============ TYPES ============

export interface IIPRateLimit extends Document {
  _id: mongoose.Types.ObjectId;
  ipAddress: string;
  leadCount: number;
  windowStart: Date;
  blockedUntil?: Date;
}

// ============ SCHEMA ============

const IPRateLimitSchema = new Schema<IIPRateLimit>({
  ipAddress: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  leadCount: {
    type: Number,
    default: 0,
  },
  windowStart: {
    type: Date,
    default: Date.now,
  },
  blockedUntil: {
    type: Date,
  },
});

// Auto-expire documents after 2 hours (cleanup)
IPRateLimitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 7200 });

// ============ MODEL ============

const IPRateLimit: Model<IIPRateLimit> =
  mongoose.models.IPRateLimit ||
  mongoose.model<IIPRateLimit>("IPRateLimit", IPRateLimitSchema);

export default IPRateLimit;

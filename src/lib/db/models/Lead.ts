import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============ TYPES ============

export const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
  "stale",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_SOURCES = [
  "website",
  "referral",
  "social_media",
  "phone",
  "email",
  "walk_in",
  "manual",
  "other",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface ITraveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
}

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;

  // From landing page form — Step 1
  tripType: "domestic" | "international";
  departureCity: string;
  destination: string;
  travelDate: string; // DD/MM/YYYY format
  duration: string;
  guests: number;
  budget: number;

  // From landing page form — Step 2
  specialRequests?: string;
  travelers: ITraveler[];

  // CRM fields — Admin Panel
  source: LeadSource;
  stage: LeadStage;
  previousStage?: string;
  notes?: string;
  agentId?: mongoose.Types.ObjectId;
  ipAddress?: string;

  // Timestamps
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============ SUB-SCHEMAS ============

const TravelerSchema = new Schema<ITraveler>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

// ============ MAIN SCHEMA ============

const LeadSchema = new Schema<ILead>(
  {
    // === FROM LANDING PAGE FORM (Step 1) ===
    tripType: {
      type: String,
      enum: ["domestic", "international"],
      required: [true, "Trip type is required"],
    },
    departureCity: {
      type: String,
      required: [true, "Departure city is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    travelDate: {
      type: String,
      required: [true, "Travel date is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: 1,
      max: 50,
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: 1,
    },

    // === FROM LANDING PAGE FORM (Step 2) ===
    specialRequests: {
      type: String,
      maxlength: 500,
    },
    travelers: {
      type: [TravelerSchema],
      validate: {
        validator: (v: ITraveler[]) => v.length >= 1,
        message: "At least one traveler is required",
      },
    },

    // === CRM FIELDS (Admin Panel) ===
    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: "website",
    },
    stage: {
      type: String,
      enum: LEAD_STAGES,
      default: "new",
    },
    previousStage: {
      type: String,
      enum: LEAD_STAGES,
    },
    notes: {
      type: String,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: {
      type: String,
    },

    // === ACTIVITY TRACKING ===
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// ============ INDEXES ============

LeadSchema.index({ stage: 1 });
LeadSchema.index({ agentId: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ lastActivityAt: 1 });
LeadSchema.index({ stage: 1, lastActivityAt: 1 }); // For stale lead detection

// ============ MODEL ============

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;

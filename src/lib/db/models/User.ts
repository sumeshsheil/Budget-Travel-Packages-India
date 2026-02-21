import mongoose, { Schema, type Document, type Model } from "mongoose";

// ============ TYPES ============

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: "admin" | "agent" | "customer";
  status: "active" | "inactive";
  phone?: string;
  altPhone?: string;
  mustChangePassword: boolean;
  isActivated: boolean;
  setPasswordToken?: string;
  setPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  image?: string;
  gender?: "male" | "female" | "other";
  documents?: {
    aadharCard: string[];
    passport: string[];
  };
  isVerified: boolean;
  members?: IMember[];
}

export interface IMember {
  name: string;
  email?: string;
  gender: "male" | "female" | "other";
  age: number;
}

// ============ SCHEMA ============

const MemberSchema = new Schema<IMember>({
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  age: { type: Number, required: true, min: 0, max: 120 },
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "agent", "customer"],
        message: "{VALUE} is not a valid role",
      },
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is not a valid status",
      },
      default: "active",
    },
    phone: {
      type: String,
      trim: true,
    },
    altPhone: {
      type: String,
      trim: true,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    setPasswordToken: {
      type: String,
    },
    setPasswordExpires: {
      type: Date,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    image: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    documents: {
      aadharCard: [{ type: String }],
      passport: [{ type: String }],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    members: {
      type: [MemberSchema],
      validate: [
        (val: IMember[]) => val.length <= 30,
        "Cannot exceed 30 members",
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// ============ INDEXES ============

UserSchema.index({ role: 1, status: 1 });

// ============ MODEL ============

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

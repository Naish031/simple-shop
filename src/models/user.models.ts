import type { UserDocument } from "@/types/user.types";
import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    forgotPasswordToken: {
      type: String,
      default: null,
    },
    forgotPasswordExpiry: {
      type: Date,
      default: null,
    },
    verifyToken: {
      type: String,
      default: null,
    },
    verifyTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model<UserDocument>("User", UserSchema);
export default User;

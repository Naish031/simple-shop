import type { Types } from "mongoose";

export interface MongooseUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
  isApproved: boolean;
  password?: string;
  forgotPasswordToken?: string | null;
  forgotPasswordExpiry?: Date | null;
  verifyToken?: string | null;
  verifyTokenExpiry?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}


export type UserTable = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  isVerified: boolean;
  isApproved: boolean;
};
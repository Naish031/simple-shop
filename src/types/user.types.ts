export interface UserDocument {
  _id: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  isVerified?: boolean;
  role?: "user" | "admin";
  forgotPasswordToken?: string | null;
  forgotPasswordExpiry?: Date | null;
  verifyToken?: string | null;
  verifyTokenExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

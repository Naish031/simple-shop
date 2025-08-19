import { connectDB } from "@/lib/db";
import User from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { username, email, password } = requestBody;

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // checking if there is an existing admin user
    const existingAdmin = await User.findOne({ role: "admin" });

    const isFirstUser = !existingAdmin;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: isFirstUser ? "admin" : "user",
      isApproved: isFirstUser,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: isFirstUser
          ? "Admin user created successfully"
          : "User created successfully",
      },
      { status: 201 }
    );
  } catch (error: Error | unknown) {
    console.error("Error in POST /api/users/register:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

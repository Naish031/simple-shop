import { connectDB } from "@/lib/db";
import User from "@/models/user.models";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    console.warn("Unauthorized access attempt by:", user?.email);
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await connectDB();

    const body = await req.json();
    const { userId } = body;

    if (!userId || typeof userId !== "string") {
      console.warn("Missing or invalid userId:", body);
      return NextResponse.json(
        { error: "Missing or invalid userId" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    );

    if (!updatedUser) {
      console.warn("User not found for ID:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error approving user:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

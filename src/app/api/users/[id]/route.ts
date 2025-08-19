import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "@/models/user.models";

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return errorResponse("Unauthorized", 401);
  }

  const { id } = params;
  const body = await req.json();

  const allowedRoles = ["admin", "user"];

  const updates: Partial<{
    username: string;
    role: "admin" | "user";
    isApproved: boolean;
  }> = {};

  if (typeof body.username === "string" && body.username.trim() !== "") {
    updates.username = body.username.trim();
  }

  if (allowedRoles.includes(body.role)) {
    updates.role = body.role;
  }

  if (typeof body.isApproved === "boolean") {
    updates.isApproved = body.isApproved;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);
    return errorResponse("Server error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return errorResponse("Unauthorized", 401);
  }

  const { id } = params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return errorResponse("Server error", 500);
  }
}

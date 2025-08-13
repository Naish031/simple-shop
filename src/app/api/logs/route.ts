import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Log from "@/models/log.models";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .populate("userId", "name email")
      .populate("itemId", "name");

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("[GET_LOGS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

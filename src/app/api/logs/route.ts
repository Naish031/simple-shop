import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Log from "@/models/log.models"; // update path as needed

export async function GET() {
  try {
    await connectDB();

    const logs = await Log.find()
      .sort({ timestamp: -1 }) // latest first
      .populate("userId", "name email") // Optional: shows who did it
      .populate("itemId", "name"); // Optional: shows what item

    return NextResponse.json(logs);
  } catch (error) {
    console.error("[GET_LOGS_ERROR]", error);
    return new NextResponse("Failed to fetch logs", { status: 500 });
  }
}

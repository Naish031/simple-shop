// POST new item, GET all items

// /api/inventory/route.ts
import { NextResponse } from "next/server";
import Inventory from "@/models/inventory.model";
import { connectDB } from "@/lib/db";

// GET /api/inventory → get all inventory items
export async function GET() {
  await connectDB();
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "No items found" }, { status: 404 });
    }

    // Convert items to plain objects to avoid Mongoose document issues
    const itemsPlain = items.map((item) => item.toObject());

    // Return the items as json
    return NextResponse.json(itemsPlain, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

// POST /api/inventory → create new inventory item
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const newItem = await Inventory.create(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
// GET one, PUT (edit), DELETE

// /api/inventory/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Inventory from "@/models/inventory.model";
import { Types } from "mongoose";

// GET one item by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const item = await Inventory.findById(id).lean();

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch item by ID" },
      { status: 500 }
    );
  }
}

// UPDATE an item by ID
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const { id } = await params;
    const body = await req.json();

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const updatedItem = await Inventory.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE an item by ID
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}

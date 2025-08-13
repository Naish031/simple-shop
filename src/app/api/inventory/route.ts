import { NextResponse } from "next/server";
import Inventory from "@/models/inventory.model";
import { connectDB } from "@/lib/db";
import { requireAdmin, getSession } from "@/lib/auth";


export async function GET() {
  await connectDB();
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await Inventory.find().sort({ createdAt: -1 });

    if (!items || items.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Convert items to plain objects and map _id to id for frontend compatibility
    const itemsPlain = items.map((item) => {
      const itemObj = item.toObject();
      return {
        ...itemObj,
        id: itemObj._id.toString(),
        _id: undefined,
      };
    });

    return NextResponse.json(itemsPlain, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectDB();

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

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

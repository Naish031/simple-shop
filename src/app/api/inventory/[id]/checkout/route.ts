// src/app/api/inventory/[id]/checkout/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Inventory from "@/models/inventory.model";
import Log from "@/models/log.models";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id: itemId } = await params;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { quantity } = await req.json();

  if (!quantity || quantity <= 0) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  try {
    const item = await Inventory.findById(itemId);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.quantity < quantity) {
      return NextResponse.json(
        { error: "Not enough quantity available" },
        { status: 400 }
      );
    }

    // Update inventory quantity
    item.quantity -= quantity;
    await item.save();

    // Create a log
    await Log.create({
      itemId,
      userId,
      quantityChanged: quantity,
      action: "checkout",
      timestamp: new Date(),
    });

    return NextResponse.json(
      { message: "Item checked out successfully", item },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// src/app/admin/inventory/data.ts
import Inventory from "@/models/inventory.model";
import type { InventoryTableItem } from "@/types/inventory.types";
import { connectDB } from "@/lib/db";
import type { MongooseInventory } from "@/types/inventory.types";

const LOW_STOCK_THRESHOLD = Number(
  process.env.NEXT_PUBLIC_LOW_STOCK_THRESHOLD ?? 5
);

export async function getInventoryItems(): Promise<InventoryTableItem[]> {
  await connectDB();
  const items = await Inventory.find().lean<MongooseInventory[]>().exec();

  return items.map((item) => {
    let status: InventoryTableItem["status"] = "in_stock";
    if (item.quantity === 0) status = "checked_out";
    else if (item.quantity < LOW_STOCK_THRESHOLD) status = "low_stock";

    return {
      id: item._id.toString(),
      name: item.name,
      category: item.category ?? "Uncategorized",
      quantity: item.quantity,
      status,
    };
  });
}

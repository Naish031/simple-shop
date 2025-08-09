// src/app/admin/inventory/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import { InventoryForm } from "../../components/InventoryForm";
import Inventory from "@/models/inventory.model";
import { connectDB } from "@/lib/db";
import type { MongooseInventory } from "@/types/inventory.types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditInventoryPage({ params }: Props) {
  await connectDB();
  const { id } = await params;

  // Fetch the item from database
  const item = await Inventory.findById(id);
  console.log("Fetched item:", item);

  if (!item) return notFound();

  // Convert Mongoose document to plain JavaScript object
  // This removes all the complex Mongoose types and makes it simple
  const plainItem = JSON.parse(JSON.stringify(item));

  // Create the data object for our form
  const formattedItem: MongooseInventory = {
    _id: plainItem._id,
    name: plainItem.name,
    description: plainItem.description || "",
    quantity: plainItem.quantity,
    category: plainItem.category || "",
    location: plainItem.location || "",
    status: plainItem.status,
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Inventory Item</h1>
      <InventoryForm initialData={formattedItem} isEditing />
    </div>
  );
}

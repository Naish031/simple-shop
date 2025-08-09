import type { Types } from "mongoose";

export interface MongooseInventory {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  quantity: number;
  category?: string;
  location?: string;
  status?: "available" | "checked_out" | "in_stock" | "low_stock";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryTableItem {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  status: "in_stock" | "low_stock" | "checked_out" | "available";
}

import { Schema, models, model, Document } from "mongoose";
import type { MongooseInventory } from "@/types/inventory.types";

export type InventoryDocument = MongooseInventory & Document;

const InventorySchema = new Schema<InventoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    category: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "checked_out", "in_stock", "low_stock"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

const Inventory =
  models?.Inventory || model<InventoryDocument>("Inventory", InventorySchema);

export default Inventory;

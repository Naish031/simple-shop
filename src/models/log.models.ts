import type { InventoryLog } from "@/types/log.types";
import { Schema, model, models, Document } from "mongoose";

export type InventoryLogDocument = InventoryLog & Document;

const LogSchema = new Schema<InventoryLogDocument>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["checkin", "checkout"],
      required: true,
    },
    quantityChanged: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const Log = models?.Log || model<InventoryLogDocument>("Log", LogSchema);
export default Log;

import type { Types } from "mongoose";

export interface InventoryLog {
  _id: Types.ObjectId;
  itemId: Types.ObjectId;
  userId: Types.ObjectId;
  action: "checkin" | "checkout";
  quantityChanged: number;
  timestamp: Date;
}

import { InventoryItem } from "./columns";

export const inventoryData: InventoryItem[] = [
  {
    id: "inv_001",
    itemName: "Resistance Band",
    category: "Accessories",
    quantity: 15,
    status: "in_stock",
  },
  {
    id: "inv_002",
    itemName: "Barbell",
    category: "Weights",
    quantity: 2,
    status: "low_stock",
  },
  {
    id: "inv_003",
    itemName: "Yoga Mat",
    category: "Mats",
    quantity: 0,
    status: "checked_out",
  },
];

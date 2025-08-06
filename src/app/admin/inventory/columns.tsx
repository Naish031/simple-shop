"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type InventoryItem = {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  status: "in_stock" | "checked_out" | "low_stock";
};

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "itemName",
    header: "Item Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as InventoryItem["status"];
      const label = {
        in_stock: "In Stock",
        checked_out: "Checked Out",
        low_stock: "Low Stock",
      }[status];

      const color = {
        in_stock: "green",
        checked_out: "red",
        low_stock: "yellow",
      }[status];

      return (
        <Badge variant="outline" className={`bg-${color}-200 text-black`}>
          {label}
        </Badge>
      );
    },
  },
];

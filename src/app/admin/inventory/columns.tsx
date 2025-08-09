// src/app/admin/inventory/columns.tsx
"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InventoryTableItem } from "@/types/inventory.types";

export const columns: ColumnDef<InventoryTableItem>[] = [
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
      const status = row.getValue("status") as InventoryTableItem["status"];

      const label = {
        in_stock: "In Stock",
        low_stock: "Low Stock",
        checked_out: "Checked Out",
        available: "Available",
      }[status];

      const colorClass = {
        in_stock: "bg-green-200 text-green-800",
        low_stock: "bg-yellow-200 text-yellow-800",
        checked_out: "bg-red-200 text-red-800",
        available: "bg-blue-200 text-blue-800",
      }[status];

      return <Badge className={colorClass}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;

      const handleDelete = async () => {
        const confirmed = confirm(`Delete ${item.itemName}?`);
        if (!confirmed) return;

        await fetch(`/api/inventory/${item.id}`, {
          method: "DELETE",
        });
        window.location.reload();
      };

      return (
        <div className="flex gap-2">
          <Link href={`/admin/inventory/${item.id}/edit`}>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </Link>
          <Button size="sm" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      );
    },
  },
];

"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LogEntry = {
  id: string;
  user: string;
  action: string;
  item: string;
  quantity: number;
  timestamp: string;
};

export const columns: ColumnDef<LogEntry>[] = [
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return action === "checkin" ? "Check-in" : "Check-out";
    },
  },
  {
    accessorKey: "item",
    header: "Item",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const raw = row.getValue("timestamp") as string;
      const date = new Date(raw);
      return date.toLocaleString();
    },
  },
];

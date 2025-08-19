"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LogEntry = {
  id: string;
  user: string;
  action: string;
  item: string;
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
  },
  {
    accessorKey: "item",
    header: "Item",
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

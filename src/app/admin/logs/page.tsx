import { columns, type LogEntry } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { connectDB } from "@/lib/db";
import Log from "@/models/log.models";

export const dynamic = "force-dynamic";

// Shape of a populated log returned by Mongoose with lean()
type PopulatedLog = {
  _id: string | { toString(): string };
  userId?: { name?: string; email?: string } | null;
  itemId?: { name?: string } | null;
  action: "checkin" | "checkout";
  quantityChanged: number;
  timestamp: string | Date;
};

export default async function LogsPage() {
  await connectDB();

  const logs = await Log.find()
    .sort({ timestamp: -1 })
    .populate("userId", "name email")
    .populate("itemId", "name")
    .lean<PopulatedLog[]>();

  console.log("logss from logsPage ", logs);

  const data: LogEntry[] = logs.map((log) => ({
    id: typeof log._id === "string" ? log._id : log._id.toString(),
    user: log.userId?.name || log.userId?.email || "Unknown",
    action: log.action,
    item: log.itemId?.name || "Unknown",
    quantity: log.quantityChanged,
    timestamp: new Date(log.timestamp).toISOString(),
  }));

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">User Activity Logs</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

import { columns } from "./columns";
import { logsData } from "./data";
import { DataTable } from "@/components/ui/data-table";

export default function LogsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">User Logs</h1>
      <DataTable columns={columns} data={logsData} />
    </div>
  );
}

export const dynamic = "force-dynamic";

import { columns } from "./columns";
import { getUsers } from "./data";
import { DataTable } from "@/components/ui/data-table";

export default async function UserPage() {
  const users = await getUsers();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <DataTable columns={columns} data={users} />
    </div>
  );
}

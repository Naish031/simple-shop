export const dynamic = "force-dynamic";

import Link from "next/link";
import { columns } from "./columns";
import { getInventoryItems } from "./data";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

export default async function InventoryPage() {
  const inventory = await getInventoryItems();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>{" "}
        <Link href="/admin/inventory/new">
          <Button>Add New Item</Button>{" "}
        </Link>{" "}
      </div>
      <DataTable columns={columns} data={inventory} />
    </div>
  );
}
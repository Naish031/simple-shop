import { columns } from "./columns";
import { inventoryData } from "./data";
import { DataTable } from "@/components/ui/data-table";

export default function InventoryPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <DataTable columns={columns} data={inventoryData} />
    </div>
  );
}

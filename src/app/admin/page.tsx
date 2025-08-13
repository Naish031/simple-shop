import Link from "next/link";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";

import { connectDB } from "@/lib/db";
import Inventory from "@/models/inventory.model";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Minimal shape for lean inventory docs used in topLowStock
type LeanInventory = {
  _id: string | { toString(): string };
  name: string;
  category?: string;
  quantity: number;
};

const LOW_STOCK_THRESHOLD = Number(
  process.env.NEXT_PUBLIC_LOW_STOCK_THRESHOLD ?? 5
);

export default async function AdminDashboardPage() {
  await connectDB();

  // Understand this code
  const [totalItems, totalStockAgg, lowStockItems] = await Promise.all([
    Inventory.countDocuments({}),
    Inventory.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]),
    Inventory.countDocuments({ quantity: { $lt: LOW_STOCK_THRESHOLD } }),
  ]);

  const totalStock = totalStockAgg?.[0]?.total ?? 0;

  // Fetch top 5 low-stock items
  const topLowStock = await Inventory.find({
    quantity: { $lt: LOW_STOCK_THRESHOLD },
  })
    .sort({ quantity: 1 })
    .limit(5)
    .lean<LeanInventory[]>();

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Inventory summary at a glance
          </p>
        </div>
        <div className="hidden sm:block">
          <Link href="/admin/inventory">
            <Button>Manage Inventory</Button>
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-md bg-blue-100 text-blue-600">
            <Package className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-md bg-green-100 text-green-700">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Stock</p>
            <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 flex items-center">
          <div className="p-3 rounded-md bg-orange-100 text-orange-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Low-stock Items</p>
            <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            <p className="text-xs text-gray-400 mt-1">
              Threshold: &lt; {LOW_STOCK_THRESHOLD}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/inventory">
            <Button variant="secondary">View Inventory</Button>
          </Link>
          <Link href="/admin/logs">
            <Button variant="outline">View Logs</Button>
          </Link>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Low Stock (Top 5)
        </h2>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLowStock.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    No low-stock items
                  </TableCell>
                </TableRow>
              ) : (
                topLowStock.map((item) => (
                  <TableRow
                    key={
                      typeof item._id === "string"
                        ? item._id
                        : item._id.toString()
                    }
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category ?? "—"}</TableCell>
                    <TableCell className="text-right text-orange-600 font-mono">
                      {item.quantity}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

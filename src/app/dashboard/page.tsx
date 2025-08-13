//src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, TrendingUp, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";
import type { InventoryTableItem } from "@/types/inventory.types";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [items, setItems] = useState<InventoryTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch inventory items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/inventory");
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load inventory");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
      setLoggingOut(false);
    }
  };

  const handleAction = async (id: string, action: "checkin" | "checkout") => {
    const quantity = quantities[id];

    // Validation
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity greater than 0");
      return;
    }

    // Additional validation for checkout
    if (action === "checkout") {
      const item = items.find((item) => item.id === id);
      if (item && quantity > item.quantity) {
        toast.error(
          `Cannot checkout ${quantity} items. Only ${item.quantity} available.`
        );
        return;
      }
    }

    // Set processing state
    setProcessing((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch(`/api/inventory/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || `Failed to ${action} item`);
        return;
      }

      // Update local state with new quantity
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: data.item.quantity } : item
        )
      );

      // Clear quantity input
      setQuantities((prev) => ({ ...prev, [id]: 0 }));

      // Show success message
      const actionText = action === "checkin" ? "checked in" : "checked out";
      toast.success(`Item ${actionText} successfully! Quantity: ${quantity}`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request");
    } finally {
      setProcessing((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_stock: { label: "In Stock", variant: "default" as const },
      low_stock: { label: "Low Stock", variant: "secondary" as const },
      checked_out: { label: "Checked Out", variant: "destructive" as const },
      available: { label: "Available", variant: "outline" as const },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.available;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          <span className="text-gray-600 dark:text-gray-400">
            Loading inventory...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-2">
              <Package className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Inventory Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {session?.user && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Signed in as
                  <span className="ml-1 font-medium">
                    {session.user.name || session.user.email}
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing out
                  </span>
                ) : (
                  "Sign out"
                )}
              </Button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Check in and check out items from your inventory
          </p>
        </div>

        {/* Inventory Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Inventory Items
            </h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    Available Quantity
                  </TableHead>
                  <TableHead className="w-[150px]">
                    Quantity to Process
                  </TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Package className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No inventory items found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right font-mono">
                        <span
                          className={item.quantity === 0 ? "text-red-600" : ""}
                        >
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          value={quantities[item.id] || ""}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setQuantities((prev) => ({
                              ...prev,
                              [item.id]: value,
                            }));
                          }}
                          className="w-24"
                          placeholder="Qty"
                          disabled={processing[item.id]}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleAction(item.id, "checkin")}
                            disabled={
                              processing[item.id] ||
                              !quantities[item.id] ||
                              quantities[item.id] <= 0
                            }
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processing[item.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <TrendingUp className="h-4 w-4" />
                            )}
                            Check In
                          </Button>
                          <Button
                            onClick={() => handleAction(item.id, "checkout")}
                            disabled={
                              processing[item.id] ||
                              !quantities[item.id] ||
                              quantities[item.id] <= 0 ||
                              quantities[item.id] > item.quantity
                            }
                            size="sm"
                            variant="destructive"
                          >
                            {processing[item.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            Check Out
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter a quantity and click Check In to add items or Check Out to
            remove items from inventory
          </p>
        </div>
      </div>
    </div>
  );
}

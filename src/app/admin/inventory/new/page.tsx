// src/app/admin/inventory/new/page.tsx
import { Button } from "@/components/ui/button";
import { InventoryForm } from "../components/InventoryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewInventoryPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-2">Add New Inventory Item</h1>
          <p className="text-gray-600">
            Fill out the form below to add a new item to your inventory.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link href="/admin/inventory">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </Link>
        </div>
      </div>
      <InventoryForm />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { MongooseInventory } from "@/types/inventory.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FormProps = {
  initialData?: Partial<MongooseInventory>;
  isEditing?: boolean;
};

export function InventoryForm({
  initialData = {},
  isEditing = false,
}: FormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<MongooseInventory>>({
    name: initialData.name || "",
    description: initialData.description || "",
    quantity: initialData.quantity || 0,
    category: initialData.category || "",
    location: initialData.location || "",
    status: initialData.status || "available",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: MongooseInventory["status"]) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name?.trim()) {
      toast.error("Item name is required");
      return;
    }

    if (!formData.quantity || formData.quantity < 0) {
      toast.error("Valid quantity is required");
      return;
    }

    try {
      const url = isEditing
        ? `/api/inventory/${initialData._id}`
        : "/api/inventory";

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          isEditing ? "Item updated successfully" : "Item added successfully"
        );
        router.push("/admin/inventory");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <div className="space-y-1">
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Description"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          name="quantity"
          value={formData.quantity || 0}
          onChange={handleChange}
          placeholder="Quantity"
          min="0"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          placeholder="Category"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          placeholder="Location"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status || "available"}
          onValueChange={(value: string) =>
            handleSelectChange(value as MongooseInventory["status"])
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="checked_out">Checked Out</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? "Update Item" : "Add Item"}
      </Button>
    </form>
  );
}

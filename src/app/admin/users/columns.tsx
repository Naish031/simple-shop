// src/app/admin/users/columns.tsx

"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { EditUserModal } from "./components/EditUserModal";
import type { UserTable } from "@/types/user.types";



function UserActions({ user }: { user: UserTable }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApproveClick = async () => {
    try {
      const res = await fetch("/api/users/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("User approved successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to approve user");
      console.error(error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("User deleted successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    }
  };

  return (
    <div className="space-x-2">
      {!user.isApproved && (
        <Button size="sm" variant="default" onClick={handleApproveClick}>
          Approve
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
        Edit
      </Button>
      <Button size="sm" variant="destructive" onClick={handleDeleteClick}>
        Delete
      </Button>

      {isModalOpen && (
        <EditUserModal
          user={user}
          onUpdate={() => {
            setIsModalOpen(false);
            window.location.reload();
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export const columns: ColumnDef<UserTable>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserTable["role"];
      return (
        <Badge variant={role === "admin" ? "destructive" : "outline"}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ row }) => (
      <Badge variant={row.original.isVerified ? "default" : "secondary"}>
        {row.original.isVerified ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    accessorKey: "isApproved",
    header: "Approved",
    cell: ({ row }) => (
      <Badge variant={row.original.isApproved ? "default" : "secondary"}>
        {row.original.isApproved ? "Yes" : "No"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];

// src/app/admin/users/components/EditUserModal.tsx

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "@/types/user.types";
import toast from "react-hot-toast";

interface EditUserModalProps {
  user: UserTable | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditUserModal({ user, onClose, onUpdate }: EditUserModalProps) {
  const [username, setUsername] = useState(user?.username || "");
  const [role, setRole] = useState<UserTable["role"]>(user?.role || "user");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUsername(user?.username || "");
    setRole(user?.role || "user");
  }, [user]);

  const isValid = username.trim() !== "";
  const isUnchanged = username === user?.username && role === user?.role;

  const handleSave = async () => {
    if (!user || !isValid || isUnchanged) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, role }),
      });

      if (!res.ok) throw new Error("Update failed");
      toast.success("User updated successfully");
      onUpdate();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserTable["role"])}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid || isUnchanged || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

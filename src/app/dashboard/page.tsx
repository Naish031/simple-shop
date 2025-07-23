"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <div>this is a dashboard page</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;

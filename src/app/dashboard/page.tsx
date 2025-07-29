"use client";

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-black/60 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600 dark:text-indigo-400">
          Dashboard
        </h1>

        {session?.user && (
          <p className="text-gray-700 dark:text-gray-200 mb-4 text-center">
            Hello,{" "}
            <span className="font-medium text-indigo-800 dark:text-indigo-300">
              {session.user.name || session.user.email}
            </span>
            !
          </p>
        )}

        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-6 overflow-auto text-sm text-gray-800 dark:text-gray-100">
          {JSON.stringify(session, null, 2)}
        </pre>

        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 dark:from-pink-600 dark:to-red-600 text-white font-semibold py-2 rounded-full transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default Dashboard;

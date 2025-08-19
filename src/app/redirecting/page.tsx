"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession } from "next-auth/react";

export default function RedirectingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const session = await getSession();

      setTimeout(() => {
        if (session?.user?.role === "admin") {
          router.push("/admin/");
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    };

    checkRole();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-xl">Redirecting to your dashboard...</p>
    </div>
  );
}

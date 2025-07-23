"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { loginUser } from "@/lib/api";
import type { LoginFormData } from "@/types/auth";
import Image from "next/image";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      await loginUser(formData);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("An error occurred during login");
      setError(error instanceof Error ? error.message : "Login failed");
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Log In to Your Account
      </h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Log In
        </button>

        <hr />
        <div className="mt-4 text-center flex items-center justify-center">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full py-2 mt-4 border border-gray-300 rounded hover:bg-gray-100 transition cursor-pointer"
          >
            <Image
              src={"/google.svg"}
              alt="Google Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Google
          </button>
        </div>
      </form>
      <p className="mt-4 text-center text-sm">
        Don’t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register Here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

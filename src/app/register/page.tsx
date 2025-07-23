"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { registerUser } from "@/lib/api";
import type { RegisterFormData } from "@/types/auth";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser(formData);
      toast.success("Registration successful!");
      router.push("/login");
    } catch (error) {
      toast.error("An error occurred during registration");
      setError(error instanceof Error ? error.message : "Registration failed");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="John Doe"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

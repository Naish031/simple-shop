"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import type { LoginFormData } from "@/types/auth.types";
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

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
    } else {
      toast.success("Login successful!");

      router.push("/redirecting");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/redirecting" });
  };

  return (
    <div
      className="
      max-w-md mx-auto mt-12 p-8
      bg-white dark:bg-gray-800
      shadow-lg dark:shadow-gray-700
      rounded-lg
    "
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Log In to Your Account
      </h2>

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full px-3 py-2
              border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              rounded
            "
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="
              w-full px-3 py-2
              border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              rounded
            "
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="
            w-full py-2 mt-4
            bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
            text-white
            rounded
            transition
          "
        >
          Log In
        </button>

        <hr className="my-4 border-gray-200 dark:border-gray-600" />

        <div className="text-center">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="
              flex items-center justify-center
              w-full py-2
              border border-gray-300 dark:border-gray-600
              bg-gray-100 dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              rounded
              hover:bg-gray-200 dark:hover:bg-gray-600
              transition
            "
          >
            <Image
              src="/google.svg"
              alt="Google Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Google
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Register Here
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

"use client";

import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const message: Record<string, string> = {
    "You need to be approved to log in.":
      "Your account is not approved yet. Please contact admin or try again later.",
    "An account with this email already exists. Please sign in using your email and password.":
      "Email is already registered with credentials. Use email/password instead of Google.",
    default: "An unexpected error occurred. Please try again.",
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6 px-4 text-center">
      <AlertTriangle className="text-red-500 w-12 h-12" />
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      {/* TODO: The error is default because it has not been set properly */}
      <p className="text-gray-700">{message[error || ""] || message.default}</p>
      <Link href="/login">
        <Button variant="default">Go back to login</Button>
      </Link>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col justify-center items-center space-y-6 px-4 text-center">
          <AlertTriangle className="text-red-500 w-12 h-12" />
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-gray-700">Loading...</p>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}

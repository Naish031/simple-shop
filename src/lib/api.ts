import type { RegisterFormData } from "@/types/auth";

export async function registerUser(formData: RegisterFormData) {
  // Removing confirmPassword from the data to send
  const { confirmPassword, ...dataToSend } = formData;

  const response = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Registration failed");
  }
  return data;
}

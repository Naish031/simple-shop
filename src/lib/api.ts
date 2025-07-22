import type { LoginFormData, SignupFormData } from "@/types/auth";

export async function signupUser(formData: SignupFormData) {
  // Removing confirmPassword from the data to send
  const { confirmPassword, ...dataToSend } = formData;

  const response = await fetch("/api/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSend),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || "Signup failed");
  }
  return data;
}

export async function loginUser(formData: LoginFormData) {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

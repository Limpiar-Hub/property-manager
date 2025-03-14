"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData) {
  try {
    // Extract form data
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = "property_manager"; // Hardcoded as per requirements

    // Validate input
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      throw new Error("All fields are required.");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    // Prepare the request body
    const body = {
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      role,
    };

    // Make API call to the backend
    const response = await fetch(
      "https://limpiar-backend.onrender.com/api/auth/register", // Correct backend URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    // Parse the JSON response
    const responseData = await response.json();

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(responseData.message || "Registration failed");
    }

    // Save phone number to cookies
    (await
          // Save phone number to cookies
          cookies()).set("phoneNumber", phoneNumber);

    // Redirect to OTP verification page
    redirect("/verify-otp");
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
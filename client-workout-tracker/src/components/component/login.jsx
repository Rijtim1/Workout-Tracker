"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter(); // Use the correct useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message state

    try {
      const response = await fetch("http://localhost:8000/api/user/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      // Store the token in local storage
      localStorage.setItem("token", data.access_token);

      // Display success message
      setMessage("Login successful!");
      setIsError(false); // Set isError to false for a success message

      // Redirect to dashboard
      router.push("/dashboard");

    } catch (err) {
      // Display error message
      setMessage(`Error: ${err.message}`);
      setIsError(true); // Set isError to true for an error message
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Login</h2>
      {message && <p className={isError ? "text-red-500" : "text-green-500"}>{message}</p>}
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="my_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}

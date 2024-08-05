import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false); // State to track if the message is an error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message state

    const user = {
      username: name,
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8000/api/user/register_user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      // Display success message
      setMessage("User registered successfully!");
      setIsError(false); // Set isError to false for a success message
    } catch (err) {
      // Display error message
      setMessage(`Error: ${err.message}`);
      setIsError(true); // Set isError to true for an error message
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
      {message && <p className={isError ? "text-red-500" : "text-green-500"}>{message}</p>}
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="john_doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="my_email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Create Account
        </Button>
      </form>
    </div>
  );
}

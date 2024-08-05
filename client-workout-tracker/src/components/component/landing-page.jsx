"use client";
import React, { useEffect, useState } from "react";
import { Register } from "@/components/component/Register";
import { Login } from "@/components/component/Login";
import { Welcome } from "@/components/component/Welcome";

export function LandingPage() {
  // Use state to handle client-specific logic, such as showing/hiding components
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set the mounted state to true to ensure code runs only on the client
    setIsMounted(true);
  }, []);

  // Conditional rendering based on whether the component is mounted
  if (!isMounted) {
    return null; // Optionally return a loading state here
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Welcome />
      <div className="mx-auto grid w-full max-w-[800px] grid-cols-1 gap-8 rounded-lg border bg-card p-6 shadow-lg md:grid-cols-2 md:gap-12 md:p-12">
        <Login />
        <Register />
      </div>
    </div>
  );
}

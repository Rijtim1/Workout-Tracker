'use client';
import React, { useEffect, useState } from 'react';
import { Register } from '@/components/component/Register';
import { Login } from '@/components/component/Login';
import { Welcome } from '@/components/component/Welcome';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Import Tabs components

export function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);  // Ensures the component logic is handled client-side.
  }, []);

  if (!isMounted) {
    return null; // Optionally return a placeholder or loading indicator.
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Welcome />
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="mb-4 flex justify-center">
          <TabsTrigger value="login" className="flex-1 text-center">Login</TabsTrigger>
          <TabsTrigger value="register" className="flex-1 text-center">Register</TabsTrigger>
        </TabsList>
        <div className="rounded-lg border bg-card p-6 shadow-lg">
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="register">
            <Register />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [username, setUsername] = useState('John Doe'); // Default username
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/user/dashboard',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUsername(data.username);
        localStorage.setItem('username', data.username); // Store username in local storage
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    // Check if the username is already in local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // Use the stored username if available
    } else {
      fetchUserData(); // Fetch from API if not available in local storage
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Remove the token and username from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');

      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

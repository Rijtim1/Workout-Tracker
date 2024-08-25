'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut } from 'lucide-react'

export function Header() {
  const [username, setUsername] = useState('John Doe') // Use state to store the username
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch user data')

        const data = await response.json()
        setUsername(data.username) // Set the username from the response
        localStorage.setItem('username', data.username) // Save username to local storage
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }

    const storedUsername = localStorage.getItem('username') // Check if the username is stored in local storage
    if (storedUsername) {
      setUsername(storedUsername) // Set the state with stored username
    } else {
      fetchUserData() // Fetch from API if not found in local storage
    }
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) throw new Error('Logout failed')

      localStorage.removeItem('token') // Remove token from local storage
      localStorage.removeItem('username') // Remove username from local storage
      router.push('/') // Redirect to home page
    } catch (err) {
      console.error('Error during logout:', err)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt={username} />
              <AvatarFallback>{username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {username.toLowerCase().replace(' ', '.')}@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

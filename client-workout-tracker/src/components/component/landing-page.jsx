'use client';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"

function AuthForm({
  type
}) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [message, setMessage] = useState(null)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const validateForm = () => {
    if (!formData.username) {
      setMessage({ text: 'Username is required.', type: 'error' })
      return false
    }
    if (type === 'register') {
      if (!formData.email) {
        setMessage({ text: 'Email is required.', type: 'error' })
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setMessage({ text: 'Invalid email format.', type: 'error' })
        return false
      }
    }
    if (formData.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!validateForm()) return

    try {
      const endpoint = type === 'login' 
        ? 'http://localhost:8000/api/user/token' 
        : 'http://localhost:8000/api/user/register_user/'

      const body = type === 'login'
        ? new URLSearchParams(formData)
        : JSON.stringify(formData)

      const headers = type === 'login'
        ? { 'Content-Type': 'application/x-www-form-urlencoded' }
        : { 'Content-Type': 'application/json' }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong')
      }

      if (type === 'login') {
        localStorage.setItem('token', data.access_token)
        router.push('/dashboard')
      } else {
        setMessage({ text: 'User registered successfully!', type: 'success' })
      }
    } catch (err) {
      setMessage(
        { text: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' }
      )
    }
  }

  return (
    (<form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="john_doe"
          value={formData.username}
          onChange={handleChange}
          required />
      </div>
      {type === 'register' && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required />
      </div>
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          {message.type === 'error' ? (
            <ExclamationTriangleIcon className="h-4 w-4" />
          ) : (
            <CheckCircledIcon className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full">
        {type === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>)
  );
}

export function LandingPage() {
  return (
    (<div
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Workout Tracker</CardTitle>
          <CardDescription className="text-center">Login or create an account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <AuthForm type="login" />
            </TabsContent>
            <TabsContent value="register">
              <AuthForm type="register" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>)
  );
}
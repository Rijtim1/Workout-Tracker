'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Dumbbell } from 'lucide-react'

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No token found')
        }

        const response = await fetch('http://localhost:8000/api/exercise/exercises', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch workouts')
        }

        const data = await response.json()
        setWorkouts(data)
      } catch (err) {
        console.error('Error fetching workouts:', err)
        setError('Failed to load workouts. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const categories = ['all', ...new Set(workouts.map((workout) => workout.category))]

  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'all' || workout.category === selectedCategory)
  )

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Workouts</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search Workout"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {capitalizeWords(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="text-center text-gray-500">No workouts found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <Link key={workout.id} href={`/dashboard/workouts/${workout.id}`} prefetch={false}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    {workout.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Category: {capitalizeWords(workout.category)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">Level: {capitalizeWords(workout.level)}</p>
                  <div className="text-sm">
                    <p className="font-semibold">Primary Muscles:</p>
                    <p className="mb-2">{workout.primaryMuscles.join(', ')}</p>
                    {workout.secondaryMuscles.length > 0 && (
                      <>
                        <p className="font-semibold">Secondary Muscles:</p>
                        <p>{workout.secondaryMuscles.join(', ')}</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

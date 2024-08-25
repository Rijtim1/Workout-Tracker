'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Dumbbell, Activity, Target } from 'lucide-react'

export default function WorkoutDetail() {
  const { workoutDetails } = useParams()
  const router = useRouter()
  const [workout, setWorkout] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No token found')
        }

        if (!workoutDetails) {
          throw new Error('Exercise ID is missing.')
        }

        const response = await fetch(
          `http://localhost:8000/api/exercise/exercises/${workoutDetails}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch workout details')
        }

        const data = await response.json()
        setWorkout(data)
      } catch (err) {
        console.error('Error fetching workout details:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (workoutDetails) {
      fetchWorkout()
    }
  }, [workoutDetails])

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={() => router.push('/dashboard/workouts')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workouts
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        onClick={() => router.push('/dashboard/workouts')}
        className="mb-6"
        variant="outline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workouts
      </Button>

      {isLoading ? (
        <WorkoutDetailSkeleton />
      ) : workout ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{workout.name}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Activity className="mr-2 h-4 w-4" />
                Level: {workout.level}
              </div>
              <div className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Category: {workout.category}
              </div>
              <div className="flex items-center">
                <Dumbbell className="mr-2 h-4 w-4" />
                Equipment: {workout.equipment}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
              <ul className="list-decimal list-inside space-y-2">
                {workout.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Muscles Worked</h2>
              <div className="flex flex-wrap gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Primary Muscles</h3>
                  <ul className="list-disc list-inside">
                    {workout.primaryMuscles.map((muscle, index) => (
                      <li key={index}>{muscle}</li>
                    ))}
                  </ul>
                </div>
                {workout.secondaryMuscles.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1">Secondary Muscles</h3>
                    <ul className="list-disc list-inside">
                      {workout.secondaryMuscles.map((muscle, index) => (
                        <li key={index}>{muscle}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workout.images.map((image, index) => (
                  <Image
                    key={index}
                    src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${image}`}
                    alt={`${workout.name} demonstration ${index + 1}`}
                    width={500}
                    height={300}
                    layout="responsive"
                    className="rounded-lg shadow-md"
                  />
                ))}
              </div>
            </section>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function WorkoutDetailSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />

        <Skeleton className="h-4 w-1/3 mb-4" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-20 w-1/3" />
          <Skeleton className="h-20 w-1/3" />
        </div>

        <Skeleton className="h-4 w-1/4 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

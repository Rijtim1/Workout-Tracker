'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { CalendarIcon, Dumbbell, ClipboardList, AlertCircle } from 'lucide-react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CreateExerciseLog() {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // Set default date to today
    },
  })
  const [exerciseOptions, setExerciseOptions] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchExercises = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('You must be logged in to create an exercise log.')
        return
      }
      try {
        const response = await fetch('http://localhost:8000/api/exercise/exercises', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          if (response.status === 401) {
            setError('Your session has expired. Please log in again.')
            localStorage.removeItem('token')
          } else if (response.status === 500) {
            setError('There was a server error. Please try again later.')
          } else {
            throw new Error(`Failed to fetch exercises: ${response.statusText}`)
          }
        }
        const data = await response.json()
        setExerciseOptions(data.map((exercise) => ({
          value: exercise.id,
          label: exercise.name,
        })))
      } catch (err) {
        console.error('Error fetching exercises:', err.message)
        setError('There was an error fetching the exercises. Please check your internet connection and try again.')
      }
    }
    fetchExercises()
  }, [])

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('You must be logged in to create an exercise log.')
      return
    }
    if (!selectedExercise) {
      setError('Please select an exercise.')
      return
    }

    const logData = {
      exercise_id: selectedExercise.value,
      exercise_name: selectedExercise.label,
      date: new Date(data.date).toISOString(),
      sets: parseInt(data.sets, 10),
      reps: parseInt(data.reps, 10),
      weight: data.weight ? parseFloat(data.weight) : null,
      notes: data.notes || '',
    }
    try {
      const response = await fetch('http://localhost:8000/api/exercise_logs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(logData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Validation error:', errorData)
        const errorMessage = errorData.detail || 'Unknown error'
        throw new Error(`Failed to create exercise log: ${errorMessage}`)
      }

      setError('Exercise log created successfully!')
      router.push('/dashboard/exercise-log')
    } catch (err) {
      console.error('Error creating exercise log:', err.message)
      setError(`There was an error creating the exercise log: ${err.message}`)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Dumbbell className="mr-2" />
          Create Exercise Log
        </CardTitle>
        <CardDescription>Record your workout details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise Name</Label>
              <Controller
                name="selectedExercise"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.value || ''}
                    onValueChange={(value) => {
                      const selected = exerciseOptions.find((option) => option.value === value)
                      setSelectedExercise(selected)
                      setValue('selectedExercise', selected)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exercise..." />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseOptions.map((exercise) => (
                        <SelectItem key={exercise.value} value={exercise.value}>
                          {exercise.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input id="date" type="date" {...field} className="pl-10" required />
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sets">Sets</Label>
                <Controller
                  name="sets"
                  control={control}
                  render={({ field }) => (
                    <Input id="sets" type="number" {...field} required />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reps">Reps</Label>
                <Controller
                  name="reps"
                  control={control}
                  render={({ field }) => (
                    <Input id="reps" type="number" {...field} required />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <Input id="weight" type="number" step="0.1" {...field} />
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea id="notes" rows={4} {...field} placeholder="Add any additional notes here..." />
                )}
              />
            </div>
          </div>
          {error && (
            <Alert variant={error.includes('successfully') ? "default" : "destructive"} className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Status</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit(onSubmit)}>
          <ClipboardList className="mr-2" />
          Create Log
        </Button>
      </CardFooter>
    </Card>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import ExerciseCard from '@/components/component/exercise-card'

// Import icons from the correct source
import { ClipboardList, Bolt, Calendar, Flame } from 'lucide-react'

export default function ContentArea() {
  const [exerciseLogs, setExerciseLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExerciseLogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/exercise_logs/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch exercise logs')

        const data = await response.json()
        setExerciseLogs(data)
      } catch (err) {
        console.error('Error fetching exercise logs:', err)
        setError('Failed to load exercise logs.')
      } finally {
        setLoading(false)
      }
    }

    fetchExerciseLogs()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-destructive">{error}</div>
  }

  return (
    <main className="p-4 sm:p-6">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: ClipboardList, label: "Workouts Completed", value: "12", bgColor: "bg-blue-500", textColor: "text-white" },
            { icon: Bolt, label: "Calories Burned", value: "1,234", bgColor: "bg-yellow-200", textColor: "text-black" },
            { icon: Calendar, label: "Active Days This Week", value: "7", bgColor: "bg-green-200", textColor: "text-black" },
            { icon: Flame, label: "Consecutive Active Days", value: "15", bgColor: "bg-gray-200", textColor: "text-black" },
          ].map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} ${stat.textColor} p-4 rounded-lg`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                {/* Ensure the icon is correctly rendered */}
                {React.createElement(stat.icon, { className: "h-4 w-4" })}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Review your recent workout history.</CardDescription>
          </CardHeader>
          <CardContent>
            {exerciseLogs.length === 0 ? (
              <p>No recent workouts found.</p>
            ) : (
              <ul className="space-y-4">
                {exerciseLogs.map((log, index) => (
                  <li key={index}>
                    <ExerciseCard exerciseLog={log} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

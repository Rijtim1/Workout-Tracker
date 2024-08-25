'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ExerciseCard from '@/components/component/exercise-card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Search } from "lucide-react"

export default function ExerciseLog() {
  const [exerciseLogs, setExerciseLogs] = useState([]) // Initialized with an empty array
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const { toast } = useToast()
  const logsPerPage = 9

  useEffect(() => {
    const fetchExerciseLogs = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')

        const response = await fetch(
          `http://localhost:8000/api/exercise_logs/`, // Correct endpoint without query parameters
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) throw new Error('Failed to fetch exercise logs')

        const data = await response.json()
        console.log('Fetched exercise logs:', data) // Log to check the structure of the fetched data

        // Ensure that the response data is in the expected format
        setExerciseLogs(data.logs || data || [])
        setTotalPages(data.total_pages || 1)
      } catch (err) {
        console.error('Error fetching exercise logs:', err)
        toast({
          title: "Error",
          description: "Failed to load exercise logs. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchExerciseLogs()
  }, [currentPage, sortBy, toast])

  const filteredLogs = exerciseLogs.filter(log =>
    log.exercise_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleNewExerciseLog = () => {
    router.push('/dashboard/exercise-log/new')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Exercise Log</h2>
        <Button onClick={handleNewExerciseLog}>
          <Plus className="mr-2 h-4 w-4" /> New Exercise Log
        </Button>
      </div>

      <div className="flex justify-between items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Exercise Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <p className="text-center text-muted-foreground">No exercise logs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <ExerciseCard key={log.id} exerciseLog={log} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

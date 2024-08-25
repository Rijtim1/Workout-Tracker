'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, ChevronRight } from "lucide-react"

export default function ExerciseCard({ exerciseLog }) {
  return (
    <Link href={`/dashboard/exercise-log/${exerciseLog.id}`} prefetch={true}>
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold mb-1">
                Exercise: {exerciseLog.exercise_name || 'Unknown Exercise'}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {new Date(exerciseLog.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </div>
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm font-medium">Sets: {exerciseLog.sets || 'N/A'}</p>
              <p className="text-sm font-medium">Reps: {exerciseLog.reps || 'N/A'}</p>
              <p className="text-sm font-medium">Weight: {exerciseLog.weight ? `${exerciseLog.weight} kg` : 'N/A'}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {exerciseLog.category || 'Uncategorized'}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-1">View details</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

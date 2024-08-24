// client-workout-tracker\src\app\dashboard\exercise-log\[exercise_id]\page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of 'next/router'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function ExerciseLogDetails() {
  const router = useRouter(); // Updated to use `useRouter` from 'next/navigation'
  const exercise_id = router.query.exercise_id; // Direct access without destructuring
  const [exerciseLog, setExerciseLog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseLog = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(`http://localhost:8000/api/exercise_logs/${exercise_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch exercise log details');
        const data = await response.json();
        setExerciseLog(data);
      } catch (err) {
        console.error('Error fetching exercise log details:', err);
        setError('Failed to load exercise log.');
      }
    };
    if (exercise_id) fetchExerciseLog();
  }, [exercise_id]);

  return (
    <div className="p-6">
      {exerciseLog && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Exercise: {exerciseLog.exercise_name || 'Unknown Exercise'}
            </CardTitle>
            <CardDescription className="text-gray-500">
              Date: {new Date(exerciseLog.date).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div><strong>Sets:</strong> {exerciseLog.sets}</div>
            <div><strong>Reps:</strong> {exerciseLog.reps}</div>
            <div><strong>Weight:</strong> {exerciseLog.weight} kg</div>
            <div><strong>Notes:</strong> {exerciseLog.notes}</div>
          </CardContent>
        </Card>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

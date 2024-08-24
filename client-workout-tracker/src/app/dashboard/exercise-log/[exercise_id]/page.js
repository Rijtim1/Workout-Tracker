'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function ExerciseLogDetails() {
  const router = useRouter();
  const { exercise_id } = router.query; // Get the exercise_id from the URL
  const [exerciseLog, setExerciseLog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:8000/api/exercise_logs/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exercise logs');
        }

        const data = await response.json();
        setExerciseLogs(data); // This should now include exercise names
      } catch (err) {
        console.error('Error fetching exercise logs:', err);
        setError('Failed to load exercise logs.');
      }
    };

    fetchExerciseLogs();
  }, []);


  return (
    <div className="p-6">
      {exerciseLog && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Exercise ID: {exerciseLog.exercise_id}{' '}
              {/* Replace with exercise name if available */}
            </CardTitle>
            <CardDescription className="text-gray-500">
              Date: {new Date(exerciseLog.date).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Sets:</strong> {exerciseLog.sets}
            </div>
            <div>
              <strong>Reps:</strong> {exerciseLog.reps}
            </div>
            <div>
              <strong>Weight:</strong> {exerciseLog.weight} kg
            </div>
            <div>
              <strong>Notes:</strong> {exerciseLog.notes}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

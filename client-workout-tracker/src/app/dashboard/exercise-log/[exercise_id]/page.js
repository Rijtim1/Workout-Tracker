'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Import useParams for dynamic route parameters
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function ExerciseLogDetails() {
  const { exercise_id } = useParams(); // Use useParams to get the dynamic route parameter
  const [exerciseLog, setExerciseLog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseLog = async () => {
      if (!exercise_id) return; // Ensure exercise_id is defined before making the fetch call

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

    fetchExerciseLog();
  }, [exercise_id]);

  console.log('Exercise ID:', exercise_id); // Log to verify the ID
  console.log('Exercise Log:', exerciseLog); // Log to verify the fetched data

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

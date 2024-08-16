'use client';
import React, { useEffect, useState } from 'react';
import ExerciseCard from '@/components/component/exercise-card'; // Adjust the import path based on your project structure

export default function ExerciseLog() {
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(
          'http://localhost:8000/api/exercise_logs/',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch exercise logs');
        }

        const data = await response.json();
        setExerciseLogs(data);
      } catch (err) {
        console.error('Error fetching exercise logs:', err);
        setError('Failed to load exercise logs.');
      }
    };

    fetchExerciseLogs();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exercise Log</h2>
      {exerciseLogs.length === 0 ? (
        <p>No exercise logs found.</p>
      ) : (
        <div>
          {exerciseLogs.map((log) => (
            <ExerciseCard key={log.date} exerciseLog={log} />
          ))}
        </div>
      )}
    </div>
  );
}

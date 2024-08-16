'use client';
import React, { useEffect, useState } from 'react';
import ExerciseCard from '@/components/component/exercise-card'; // Adjust the import path based on your project structure

export default function ExerciseLog() {
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExerciseLogs = async () => {
            try {
                let token = '';
                try {
                  token = localStorage.getItem('token');
                } catch (e) {
                  console.error('Error accessing localStorage:', e);
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
                setExerciseLogs(data);
            } catch (err) {
                console.error('Error fetching exercise logs:', err);
                setError('Failed to load exercise logs.');
            } finally {
                setLoading(false);
            }
        };

        fetchExerciseLogs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

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

'use client';
import React, { useEffect, useState } from 'react';

export default function ExerciseLog() {
    const [exerciseLogs, setExerciseLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExerciseLogs = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/exercise_logs/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Exercise Log</h2>
            {exerciseLogs.length === 0 ? (
                <p>No exercise logs found.</p>
            ) : (
                <ul className="space-y-4">
                    {exerciseLogs.map((log) => (
                        <li key={log.date} className="border p-4 rounded">
                            <p>Date: {new Date(log.date).toLocaleString()}</p>
                            <p>Exercise ID: {log.exercise_id}</p>
                            <p>Sets: {log.sets}, Reps: {log.reps}</p>
                            <p>Weight: {log.weight} kg</p>
                            <p>Notes: {log.notes}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

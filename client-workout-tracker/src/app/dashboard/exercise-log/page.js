'use client';
import React, { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';

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
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Exercise Log</h2>
            {exerciseLogs.length === 0 ? (
                <p>No exercise logs found.</p>
            ) : (
                <div>
                    {exerciseLogs.map((log) => (
                        <Link
                            key={log.date}
                            href={`/dashboard/exercise_logs/${log.exercise_id}`}
                            prefetch={false}
                        >
                            <Card className="cursor-pointer hover:shadow-md transition-shadow mb-6">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">
                                        Exercise: {log.exercise_id} {/* Replace with exercise name if available */}
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Date: {new Date(log.date).toLocaleString()}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

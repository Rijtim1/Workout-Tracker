'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Workouts() {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await fetch('http://localhost:8000/api/exercise/exercises', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch workouts');
                }

                const data = await response.json();
                setWorkouts(data);
            } catch (err) {
                console.error('Error fetching workouts:', err);
            }
        };

        fetchWorkouts();
    }, []);

    // Function to capitalize the first letter of each word
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Workouts</h1>
            <div>
                {workouts.map((workout) => (
                    <Link key={workout.id} href={`/dashboard/workouts/${workout.id}`} prefetch={false}>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow mb-6">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">{workout.name}</CardTitle>
                                <CardDescription className="text-gray-500">
                                    Category: {capitalizeWords(workout.category)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-between items-start">
                                <p className="text-sm text-gray-500">
                                    Level: {capitalizeWords(workout.level)}
                                </p>
                                <div className="text-sm text-gray-500">
                                    <strong>Primary Muscles:</strong> {workout.primaryMuscles.join(', ')}
                                    {workout.secondaryMuscles.length > 0 && (
                                        <>
                                            <br />
                                            <strong>Secondary Muscles:</strong> {workout.secondaryMuscles.join(', ')}
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

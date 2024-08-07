'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
                        'Authorization': `Bearer ${token}`,
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

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Workouts</h1>
            <div className="grid grid-cols-1 gap-6">
                {workouts.map((workout) => (
                    <Link key={workout.id} href={`/dashboard/workouts/${workout.id}`} prefetch={false}>
                        <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <h2 className="text-xl font-semibold">{workout.name}</h2>
                            <p className="text-sm text-gray-500">Level: {workout.level}</p>
                            <p className="text-sm text-gray-500">Category: {workout.category}</p>
                            <p className="mt-2 font-semibold">Instructions:</p>
                            <ul className="list-disc list-inside">
                                {workout.instructions.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ul>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!exercise_id) return;

        const fetchExerciseLog = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/exercise_logs/${exercise_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch exercise log');
                }

                const data = await response.json();
                setExerciseLog(data);
            } catch (err) {
                console.error('Error fetching exercise log:', err);
                setError('Failed to load exercise log.');
            } finally {
                setLoading(false);
            }
        };

        fetchExerciseLog();
    }, [exercise_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!exerciseLog) {
        return <div>No exercise log found.</div>;
    }

    return (
        <div className="p-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Exercise ID: {exerciseLog.exercise_id} {/* Replace with exercise name if available */}
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
        </div>
    );
}

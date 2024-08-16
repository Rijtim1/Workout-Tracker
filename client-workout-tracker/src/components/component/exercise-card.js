'use client';
import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';

export default function ExerciseCard({ exerciseLog }) {
    return (
        <Link
            href={`/dashboard/exercise_logs/${exerciseLog.exercise_id}`}
            prefetch={false}
        >
            <Card className="cursor-pointer hover:shadow-md transition-shadow mb-6">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        Exercise: {exerciseLog.exercise_id} {/* Replace with exercise name if available */}
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Date: {new Date(exerciseLog.date).toLocaleString()}
                    </CardDescription>
                </CardHeader>
            </Card>
        </Link>
    );
}

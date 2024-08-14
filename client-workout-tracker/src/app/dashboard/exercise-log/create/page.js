'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';

export default function CreateExerciseLog() {
    const { control, handleSubmit } = useForm();
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const router = useRouter();

    // Fetch exercise names from the API
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('You must be logged in to create an exercise log.');
                    return;
                }

                const response = await fetch(
                    'http://localhost:8000/api/exercise/exercises',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch exercises');
                }

                const data = await response.json();
                const options = data.map((exercise) => ({
                    value: exercise.id,
                    label: exercise.name,
                }));
                setExerciseOptions(options);
            } catch (err) {
                console.error('Error fetching exercises:', err);
                alert('There was an error fetching the exercises.');
            }
        };

        fetchExercises();
    }, []);

    const onSubmit = async (data) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to create an exercise log.');
            return;
        }

        const logData = {
            exercise_name: data.selectedExercise.label,
            exercise_id: data.selectedExercise.value,
            duration: data.duration,
            notes: data.notes,
        };

        try {
            const response = await fetch('http://localhost:8000/api/exercise-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                throw new Error('Failed to create exercise log');
            }

            alert('Exercise log created successfully!');
            router.push('/dashboard/exercise-log'); // Redirect to the exercise log list page
        } catch (err) {
            console.error('Error creating exercise log:', err);
            alert('There was an error creating the exercise log.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create Exercise Log</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="exercise" className="block text-sm font-medium text-gray-700">Exercise Name</label>
                    <Controller
                        name="selectedExercise"
                        control={control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an exercise..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {exerciseOptions.map((exercise) => (
                                        <SelectItem key={exercise.value} value={exercise}>
                                            {exercise.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                            <Input id="duration" type="number" {...field} required />
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <Textarea id="notes" rows={4} {...field} />
                        )}
                    />
                </div>

                <Button type="submit" className="mt-4">
                    Create Log
                </Button>
            </form>
        </div>
    );
}

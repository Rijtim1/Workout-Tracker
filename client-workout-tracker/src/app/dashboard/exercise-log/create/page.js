'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

export default function CreateExerciseLog() {
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
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

                const response = await fetch('http://localhost:8000/api/exercise/exercises', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch exercises');
                }

                const data = await response.json();
                const options = data.map(exercise => ({
                    value: exercise.id,
                    label: exercise.name
                }));
                setExerciseOptions(options);
            } catch (err) {
                console.error('Error fetching exercises:', err);
                alert('There was an error fetching the exercises.');
            }
        };

        fetchExercises();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedExercise) {
            alert('Please select an exercise.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to create an exercise log.');
            return;
        }

        const logData = {
            exercise_name: selectedExercise.label,
            exercise_id: selectedExercise.value,
            duration,
            notes,
        };

        try {
            const response = await fetch('http://localhost:8000/api/exercise-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                throw new Error('Failed to create exercise log');
            }

            const data = await response.json();
            alert('Exercise log created successfully!');
            router.push('/dashboard/exercise-log');  // Redirect to the exercise log list page

        } catch (err) {
            console.error('Error creating exercise log:', err);
            alert('There was an error creating the exercise log.');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Create Exercise Log</h1>
            <Form onSubmit={handleSubmit}>
                <FormField>
                    <FormItem>
                        <FormLabel htmlFor="exercise">Exercise Name</FormLabel>
                        <FormControl>
                            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
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
                        </FormControl>
                    </FormItem>
                </FormField>

                <FormField>
                    <FormItem>
                        <FormLabel htmlFor="duration">Duration (minutes)</FormLabel>
                        <FormControl>
                            <Input
                                id="duration"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </FormControl>
                    </FormItem>
                </FormField>

                <FormField>
                    <FormItem>
                        <FormLabel htmlFor="notes">Notes</FormLabel>
                        <FormControl>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                            />
                        </FormControl>
                    </FormItem>
                </FormField>

                <Button type="submit" className="mt-4">
                    Create Log
                </Button>
            </Form>
        </div>
    );
}

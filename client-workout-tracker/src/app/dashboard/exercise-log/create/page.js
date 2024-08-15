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
    const { control, handleSubmit, setValue, watch } = useForm();
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null); // Track the selected exercise
    const router = useRouter();

    // Fetch exercise names from the API on component mount
    useEffect(() => {
        const fetchExercises = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to create an exercise log.');
                return;
            }

            try {
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

        // Make sure selectedExercise is defined
        if (!selectedExercise) {
            alert('Please select an exercise.');
            return;
        }

        const logData = {
            exercise_id: selectedExercise.value,
            date: new Date(data.date).toISOString(),
            sets: parseInt(data.sets, 10),
            reps: parseInt(data.reps, 10),
            weight: data.weight ? parseFloat(data.weight) : null,
            notes: data.notes || "",
        };


        try {
            const response = await fetch('http://localhost:8000/api/exercise_logs/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create exercise log: ${errorData.detail || 'Unknown error'}`);
            }

            alert('Exercise log created successfully!');
            router.push('/dashboard/exercise-log'); // Redirect to the exercise log list page
        } catch (err) {
            console.error('Error creating exercise log:', err);
            if (err instanceof Error) {
                console.error('Error details:', err.message);
            } else {
                console.error('Error details:', err); // Log the entire error object
            }

            alert(`There was an error creating the exercise log: ${JSON.stringify(err)}`);
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
                            <Select
                                value={field.value?.value || ""} // Use the value directly
                                onValueChange={(value) => {
                                    const selected = exerciseOptions.find(option => option.value === value);
                                    setSelectedExercise(selected); // Track selected exercise
                                    setValue('selectedExercise', selected); // Update the form state
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {selectedExercise ? selectedExercise.label : 'Select an exercise...'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {exerciseOptions.map((exercise) => (
                                        <SelectItem key={exercise.value} value={exercise.value}>
                                            {exercise.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <Input id="date" type="date" {...field} required />
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="sets" className="block text-sm font-medium text-gray-700">Sets</label>
                    <Controller
                        name="sets"
                        control={control}
                        render={({ field }) => (
                            <Input id="sets" type="number" {...field} required />
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="reps" className="block text-sm font-medium text-gray-700">Reps</label>
                    <Controller
                        name="reps"
                        control={control}
                        render={({ field }) => (
                            <Input id="reps" type="number" {...field} required />
                        )}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <Controller
                        name="weight"
                        control={control}
                        render={({ field }) => (
                            <Input id="weight" type="number" step="0.1" {...field} />
                        )}
                    />
                </div>

                <div class="mb-4">
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

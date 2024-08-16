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
    const { control, handleSubmit, setValue } = useForm();
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null); // Track the selected exercise
    const router = useRouter();

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
                    if (response.status === 401) {
                        alert('Your session has expired. Please log in again.');
                        localStorage.removeItem('token');
                        // Redirect to login page
                    } else if (response.status === 500) {
                        alert('There was a server error. Please try again later.');
                    } else {
                        throw new Error(`Failed to fetch exercises: ${response.statusText}`);
                    }
                }

                const data = await response.json();
                const options = data.map((exercise) => ({
                    value: exercise.id,
                    label: exercise.name,
                }));
                setExerciseOptions(options);
            } catch (err) {
                console.error('Error fetching exercises:', err.message);
                alert('There was an error fetching the exercises. Please check your internet connection and try again.');
            }
        };

        fetchExercises();
    }, []);

    const onSubmit = async (data) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('username');

        if (!token || !userId) {
            alert('You must be logged in to create an exercise log.');
            return;
        }

        if (!selectedExercise) {
            alert('Please select an exercise.');
            return;
        }

        if (!data.date) {
            alert('Please provide a valid date.');
            return;
        }
        if (!data.sets || isNaN(data.sets) || parseInt(data.sets, 10) <= 0) {
            alert('Please enter a valid number of sets.');
            return;
        }
        if (!data.reps || isNaN(data.reps) || parseInt(data.reps, 10) <= 0) {
            alert('Please enter a valid number of reps.');
            return;
        }
        if (data.weight && (isNaN(data.weight) || parseFloat(data.weight) < 0)) {
            alert('Please enter a valid weight.');
            return;
        }

        const logData = {
            user_id: userId,
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
                const errorMessage = errorData.detail || 'Unknown error';
                throw new Error(`Failed to create exercise log: ${errorMessage}`);
            }

            alert('Exercise log created successfully!');
            router.push('/dashboard/exercise-log');
        } catch (err) {
            console.error('Error creating exercise log:', err.message);
            alert(`There was an error creating the exercise log: ${err.message}`);
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
                                value={field.value?.value || ""}
                                onValueChange={(value) => {
                                    const selected = exerciseOptions.find(option => option.value === value);
                                    setSelectedExercise(selected);
                                    setValue('selectedExercise', selected);
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

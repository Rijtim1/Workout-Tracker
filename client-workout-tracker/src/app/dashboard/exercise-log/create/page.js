'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/navigation';

export default function CreateExerciseLog() {
    const [exerciseOptions, setExerciseOptions] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
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
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Exercise Name
                    </label>
                    <Select
                        options={exerciseOptions}
                        value={selectedExercise}
                        onChange={setSelectedExercise}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        placeholder="Select an exercise..."
                        isSearchable
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Duration (minutes)
                    </label>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        rows={4}
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    Create Log
                </button>
            </form>
        </div>
    );
}

'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image'; // Import the Image component from next/image

export default function WorkoutDetail() {
  const { workoutDetails } = useParams();
  const [workout, setWorkout] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        if (!workoutDetails) {
          throw new Error('Exercise ID is missing.');
        }

        console.log('Fetching workout with ID:', workoutDetails);

        const response = await fetch(
          `http://localhost:8000/api/exercise/exercises/${workoutDetails}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch workout details');
        }

        const data = await response.json();
        console.log('Workout data:', data);
        setWorkout(data);
      } catch (err) {
        console.error('Error fetching workout details:', err);
        setError(err.message);
      }
    };

    if (workoutDetails) {
      fetchWorkout();
    }
  }, [workoutDetails]);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (!workout) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{workout.name}</h1>
      <p className="text-sm text-gray-500">Level: {workout.level}</p>
      <p className="text-sm text-gray-500">Category: {workout.category}</p>
      <p className="text-sm text-gray-500">Equipment: {workout.equipment}</p>
      <h2 className="mt-4 text-xl font-semibold">Instructions:</h2>
      <ul className="list-disc list-inside">
        {workout.instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ul>
      <h2 className="mt-4 text-xl font-semibold">Primary Muscles:</h2>
      <ul className="list-disc list-inside">
        {workout.primaryMuscles.map((muscle, index) => (
          <li key={index}>{muscle}</li>
        ))}
      </ul>
      {workout.secondaryMuscles.length > 0 && (
        <>
          <h2 className="mt-4 text-xl font-semibold">Secondary Muscles:</h2>
          <ul className="list-disc list-inside">
            {workout.secondaryMuscles.map((muscle, index) => (
              <li key={index}>{muscle}</li>
            ))}
          </ul>
        </>
      )}
      <h2 className="mt-4 text-xl font-semibold">Images:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workout.images.map((image, index) => (
          <Image
            key={index}
            src={`http://localhost:8000/images/${image}`}
            alt={`${workout.name} image ${index + 1}`}
            width={500} // Set appropriate width
            height={300} // Set appropriate height
            layout="responsive"
            className="w-full h-auto"
          />
        ))}
      </div>
    </div>
  );
}

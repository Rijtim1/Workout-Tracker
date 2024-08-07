'use client';
import React from 'react';

// Sample data. In a real application, this might be fetched from an API.
const workoutData = [
    {
        name: "3/4 Sit-Up",
        level: "beginner",
        category: "strength",
        id: "3_4_Sit-Up",
        force: "pull",
        mechanic: "compound",
        equipment: "body only",
        primaryMuscles: ["abdominals"],
        secondaryMuscles: [],
        instructions: [
            "Lie down on the floor and secure your feet. Your legs should be bent at the knees.",
            "Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.",
            "Flex your hips and spine to raise your torso toward your knees.",
            "At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.",
            "Repeat for the recommended amount of repetitions.",
        ],
        images: ["3_4_Sit-Up/0.jpg", "3_4_Sit-Up/1.jpg"],
    },
    {
        name: "90/90 Hamstring",
        level: "beginner",
        category: "stretching",
        id: "90_90_Hamstring",
        force: "push",
        mechanic: null,
        equipment: "body only",
        primaryMuscles: ["hamstrings"],
        secondaryMuscles: ["calves"],
        instructions: [
            "Lie on your back, with one leg extended straight out.",
            "With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.",
            "Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position.",
            "Repeat for 10-20 repetitions, and then switch to the other leg.",
        ],
        images: ["90_90_Hamstring/0.jpg", "90_90_Hamstring/1.jpg"],
    },
];

export default function Workouts() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Workouts</h1>
            <div className="grid grid-cols-1 gap-6">
                {workoutData.map((workout) => (
                    <div key={workout.id} className="border p-4 rounded-lg shadow-sm">
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
                ))}
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import ExerciseCard from '@/components/component/exercise-card'; // Adjust the import path

export default function ContentArea() {
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseLogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/exercise_logs/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exercise logs');
        }

        const data = await response.json();
        setExerciseLogs(data);
      } catch (err) {
        console.error('Error fetching exercise logs:', err);
        setError('Failed to load exercise logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="p-4 sm:p-6">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-4 flex flex-col gap-2">
            <ClipboardListIcon className="h-6 w-6" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm">Workouts Completed</div>
          </div>
          <div className="bg-accent text-accent-foreground rounded-lg p-4 flex flex-col gap-2">
            <BoltIcon className="h-6 w-6" />
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-sm">Calories Burned</div>
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-lg p-4 flex flex-col gap-2">
            <CalendarIcon className="h-6 w-6" />
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm">Active Days This Week</div>
          </div>
          <div className="bg-muted text-muted-foreground rounded-lg p-4 flex flex-col gap-2">
            <FlameIcon className="h-6 w-6" />
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm">Consecutive Active Days</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>
              Review your recent workout history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {exerciseLogs.length === 0 ? (
                <p>No recent workouts found.</p>
              ) : (
                exerciseLogs.map((log) => (
                  <ExerciseCard key={log.date} exerciseLog={log} />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function BoltIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ClipboardListIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}

function FlameIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

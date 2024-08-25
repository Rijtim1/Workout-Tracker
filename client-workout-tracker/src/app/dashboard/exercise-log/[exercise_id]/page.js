'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'; // Adjust based on your actual import paths
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell, Calendar, ClipboardList } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ExerciseLogDetails() {
  const { exercise_id } = useParams();
  const router = useRouter();
  const [exerciseLog, setExerciseLog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseLog = async () => {
      if (!exercise_id) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await fetch(
          `http://localhost:8000/api/exercise_logs/${exercise_id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch exercise log details');
        const data = await response.json();
        setExerciseLog(data);
      } catch (err) {
        console.error('Error fetching exercise log details:', err);
        setError('Failed to load exercise log.');
      }
    };

    fetchExerciseLog();
  }, [exercise_id]);

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] px-6 py-6">
      <Button
        type="button"
        onClick={() => router.push('/dashboard/exercise-log')}
        className="mb-6"
        variant="outline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exercise Log
      </Button>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Only render the Card if exerciseLog is not null */}
      {exerciseLog && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Dumbbell className="mr-2 h-6 w-6" />
                {exerciseLog.exercise_name}
              </CardTitle>
              <Badge variant="secondary" className="text-sm">Active</Badge>
            </div>
            <CardDescription className="text-gray-500 flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(exerciseLog.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Sets</h3>
                <p className="text-2xl font-bold">{exerciseLog.sets}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Reps</h3>
                <p className="text-2xl font-bold">{exerciseLog.reps}</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Weight</h3>
                <p className="text-2xl font-bold">{exerciseLog.weight} kg</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Total Volume</h3>
                <p className="text-2xl font-bold">{exerciseLog.sets * exerciseLog.reps * exerciseLog.weight} kg</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <h3 className="font-semibold mb-2 flex items-center">
                <ClipboardList className="mr-2 h-4 w-4" />
                Notes
              </h3>
              <p className="text-gray-600">{exerciseLog.notes}</p>
            </div>
          </CardFooter>
        </Card>
      )}
    </ScrollArea>
  );
}

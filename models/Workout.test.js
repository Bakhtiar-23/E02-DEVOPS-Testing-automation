import axios from 'axios';
import { createServer } from 'http';
import app from '../server'; // Import your app from server.js
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import WorkoutModel from './workout.js'; // Import the WorkoutModel directly

let server;
let PORT;

beforeAll(async () => {
  PORT = 3000 + Math.floor(Math.random() * 1000);
  console.log(`Using port: ${PORT}`);

  server = createServer(app);
  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Test server running on http://localhost:${PORT}`);
        resolve();
      }
    });
  });

  // MongoDB connection: Ensure it's only called once
  if (mongoose.connection.readyState === 0) { // 0 means disconnected
    await mongoose.connect('mongodb://localhost:27017/workout_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  }
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => {
      server.close(() => {
        console.log('Test server closed');
        resolve();
      });
    });
  }

  if (mongoose.connection) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
});

jest.setTimeout(30000); // Increased timeout

// Helper function to get a workout ID by creating a workout
const getWorkoutId = async () => {
  const workout = await WorkoutModel.createWorkout('bakhtiar_ismail'); // Username used to create workout
  return workout._id;
};

describe('Workout API End-to-End Tests', () => {
  let workoutId;

  beforeEach(async () => {
    // Use the helper function to create a workout and get its ID before each test
    workoutId = await getWorkoutId();
    console.log(`Created workout with ID: ${workoutId}`);
  });

  test('should add an exercise to the workout', async () => {
    const exercise = { name: 'Push-up', sets: 3, reps: 10 };

    try {
      // Post the request to add the exercise
      const response = await axios.post(
        `http://localhost:${PORT}/api/workouts/${workoutId}/exercises`,
        { exercise }
      );
      console.log('Response:', response.data);
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('Exercise added');

      // Fetch the workout to check if exercise was added
      const updatedWorkout = await WorkoutModel.findById(workoutId);
      console.log('Updated workout:', updatedWorkout);
      expect(updatedWorkout.exercises.length).toBe(1);
      expect(updatedWorkout.exercises[0].name).toBe(exercise.name);
    } catch (error) {
      console.error('Error adding exercise:', error.response ? error.response.data : error.message);
      throw error; // Re-throw to fail the test
    }
  });

  test('should remove an exercise from the workout', async () => {
    // First, create an exercise in the workout
    const exercise = { name: 'Push-up', sets: 3, reps: 10 };
    await axios.post(
      `http://localhost:${PORT}/api/workouts/${workoutId}/exercises`,
      { exercise }
    );

    const exerciseName = 'Push-up'; // Assuming you're removing this exercise

    try {
      // Send DELETE request to remove the exercise
      const response = await axios.delete(
        `http://localhost:${PORT}/api/workouts/${workoutId}/exercises/${exerciseName}`
      );
      console.log('Response:', response.data);
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Exercise removed successfully');

      // Fetch the workout to ensure exercise is removed
      const updatedWorkout = await WorkoutModel.findById(workoutId);
      expect(updatedWorkout.exercises.length).toBe(0); // Ensure the exercise is removed
    } catch (error) {
      console.error('Error removing exercise:', error.response ? error.response.data : error.message);
      throw error; // Re-throw to fail the test
    }
  });
});

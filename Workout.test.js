import axios from 'axios';
import { createServer } from 'http';
import app from './server'; // Import your app from server.js
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

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

describe('Workout API End-to-End Tests', () => {
  let workoutId;

  beforeEach(async () => {
    // Create a workout entry before each test
    const workout = await mongoose.model('Workout').create({
      username: 'john_doe', // You can set the username as needed
      exercises: [],
    });
    workoutId = workout._id;
    console.log(`Created workout with ID: ${workoutId}`);
  });

  test('should add an exercise to the workout', async () => {
    const exercise = { name: 'Push-up', sets: 3, reps: 10 };
  
    try {
      const response = await axios.post(
        `http://localhost:${PORT}/api/workouts/${workoutId}/exercises`,
        { exercise }
      );
      console.log('Response:', response.data);
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('Exercise added');
    } catch (error) {
      console.error('Error adding exercise:', error.response ? error.response.data : error.message);
      throw error; // Re-throw to fail the test
    }
  });
  

  test('should remove an exercise from the workout', async () => {
    const workoutId = '67bb65ab98bd0aa622f6a7c5'; // Use the correct ID
    const exerciseName = 'Push-up'; // Assuming you're removing this exercise
  
    try {
      const response = await axios.delete(
        `http://localhost:${PORT}/api/workouts/${workoutId}/exercises/${exerciseName}`
      );
      console.log('Response:', response.data);
      expect(response.status).toBe(200);
      // Update the expected message here
      expect(response.data.message).toBe('Exercise removed successfully');
    } catch (error) {
      console.error('Error removing exercise:', error.response ? error.response.data : error.message);
      throw error; // Re-throw to fail the test
    }
  });
  
});

import express from 'express';
import workout from './controllers/workoutController.js'; // Import the workout controller
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const router = express.Router(); // Initialize router
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/workoutDB';
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes

// Create a workout
router.post('/workouts/:id/exercises', async (req, res) => {
  try {
    const { id } = req.params;
    const { exercise } = req.body; // Assuming body contains the exercise object

    if (!exercise || !exercise.name || !exercise.sets || !exercise.reps) {
      return res.status(400).json({ message: 'Invalid exercise data' });
    }

    const updatedWorkout = await workout.addExercise(id, exercise);

    res.status(201).json({
      message: 'Exercise added',
      workout: updatedWorkout,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding exercise', error: error.message });
  }
});


// Remove an exercise from a workout
router.delete('/workouts/:id/exercises/:exercise', async (req, res) => {
  try {
    const { id, exercise } = req.params;
    const updatedWorkout = await workout.removeExercise(id, exercise);
    res.status(200).json({
      message: 'Exercise removed successfully',
      workout: updatedWorkout,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error removing exercise', error: error.message });
  }
});

// Get all exercises for a workout
router.get('/workouts/:workoutId/exercises', async (req, res) => {
  try {
    const { workoutId } = req.params;
    const exercises = await workout.getExercises(workoutId);
    res.status(200).json({ exercises });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving exercises', error: error.message });
  }
});

// Use the router with the /api prefix
app.use('/api', router);

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;

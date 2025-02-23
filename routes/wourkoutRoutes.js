// /routes/workoutRoutes.js
import express from 'express';
import workout from '../controllers/workoutController'; // Import the workout controller

const router = express.Router();

// Route to create a workout
router.post('/workouts', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const newWorkout = await workout.createWorkout(username);
    res.status(201).json({
      message: 'Workout created successfully',
      workout: newWorkout,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating workout', error: error.message });
  }
});

// Route to add an exercise to a workout
router.post('/workouts/:workoutId/exercises', async (req, res) => {
  const { workoutId } = req.params;
  const { name, sets, reps } = req.body;

  if (!name || !sets || !reps) {
    return res.status(400).json({ message: 'Exercise details are required' });
  }

  try {
    const updatedWorkout = await workout.addExercise(workoutId, { name, sets, reps });
    res.status(200).json({
      message: 'Exercise added successfully',
      workout: updatedWorkout,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding exercise', error: error.message });
  }
});

// Route to remove an exercise from a workout
router.delete('/workouts/:workoutId/exercises/:exerciseName', async (req, res) => {
  const { workoutId, exerciseName } = req.params;

  try {
    const updatedWorkout = await workout.removeExercise(workoutId, exerciseName);
    res.status(200).json({
      message: 'Exercise removed successfully',
      workout: updatedWorkout,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing exercise', error: error.message });
  }
});

// Route to get all exercises from a workout
router.get('/workouts/:workoutId/exercises', async (req, res) => {
  const { workoutId } = req.params;

  try {
    const exercises = await workout.getExercises(workoutId);
    res.status(200).json({ exercises });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving exercises', error: error.message });
  }
});

export default router;

import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  username: { type: String, required: true },
  exercises: [{ name: String, sets: Number, reps: Number }],
});

const WorkoutModel = mongoose.model('Workout', workoutSchema);

// Create a workout
WorkoutModel.createWorkout = async (username) => {
  const workout = new WorkoutModel({ username, exercises: [] });
  await workout.save();
  return workout;
};

// Add an exercise to a workout
WorkoutModel.addExercise = async (workoutId, exercise) => {
  const workout = await WorkoutModel.findById(workoutId);
  workout.exercises.push(exercise);
  await workout.save();
  return workout;
};

// Remove an exercise from a workout
WorkoutModel.removeExercise = async (workoutId, exerciseName) => {
  const workout = await WorkoutModel.findById(workoutId);
  workout.exercises = workout.exercises.filter(
    (exercise) => exercise.name !== exerciseName
  );
  await workout.save();
  return workout;
};

// Get all exercises for a workout
WorkoutModel.getExercises = async (workoutId) => {
  const workout = await WorkoutModel.findById(workoutId);
  return workout.exercises;
};

export default WorkoutModel;

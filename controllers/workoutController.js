import WorkoutModel from '../models/workout.js'; // Import the workout model

class WorkoutController {
  // Create a workout
  async createWorkout(username) {
    try {
      const newWorkout = await WorkoutModel.createWorkout(username); // Use the method from the model
      return newWorkout;
    } catch (error) {
      throw new Error('Error creating workout: ' + error.message);
    }
  }

  // Add an exercise to a workout
  async addExercise(workoutId, exercise) {
    try {
      const updatedWorkout = await WorkoutModel.addExercise(workoutId, exercise); // Call the addExercise method from the model
      return updatedWorkout;
    } catch (error) {
      throw new Error('Error adding exercise: ' + error.message);
    }
  }

  // Remove an exercise from a workout
  async removeExercise(workoutId, exerciseName) {
    try {
      const updatedWorkout = await WorkoutModel.removeExercise(workoutId, exerciseName); // Call the removeExercise method from the model
      return updatedWorkout;
    } catch (error) {
      throw new Error('Error removing exercise: ' + error.message);
    }
  }

  // Get all exercises for a workout
  async getExercises(workoutId) {
    try {
      const exercises = await WorkoutModel.getExercises(workoutId); // Call the getExercises method from the model
      return exercises;
    } catch (error) {
      throw new Error('Error retrieving exercises: ' + error.message);
    }
  }
}

export default new WorkoutController(); // Export the instance

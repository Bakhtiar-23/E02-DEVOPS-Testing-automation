import {Workout} from './workout.js'

test("The addToWorkout function can an exercise to the workout", () => {
    const workout = new Workout()
    workout.addToWorkout("squats")
    expect(workout.exercises).toEqual(["squats"])
})

test("The removeFromWorkout function can remove an exercise to the workout", () => {
    const workout = new Workout()
    workout.addToWorkout("squats")
    workout.removeFromWorkout("squats")
})
export class Workout {
    constructor() {
        this.exercises = []
    }

    addToWorkout(exercise) {
        this.exercises.push(exercise)
    }

    removeFromWorkout(exercise) {
        this.exercises = this.exercises.filter((ex) => ex !== exercise)
    }
}
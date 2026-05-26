import { PLACEHOLDER_EXERCISE_ID } from "../types";

export type MuscleGroup =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
};

// Slice 1 ships a single placeholder. Slice 2 replaces this with a real
// curated library and picker.
const EXERCISES: Exercise[] = [
  { id: PLACEHOLDER_EXERCISE_ID, name: "Placeholder Exercise", muscleGroup: "chest" },
];

export function getAll(): Exercise[] {
  return EXERCISES;
}

export function getById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

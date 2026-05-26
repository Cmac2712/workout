export type Set = {
  id: string;
  setNumber: number;
  reps: number;
  weight: number; // kg, decimal allowed
};

export type SessionExercise = {
  id: string;
  exerciseId: string; // FK into exerciseLibrary
  order: number;
  sets: Set[];
};

export type Session = {
  id: string;
  startedAt: number; // epoch ms
  endedAt: number | null;
  sessionExercises: SessionExercise[];
};

export const SCHEMA_VERSION = 1 as const;

export type PersistedState = {
  schemaVersion: typeof SCHEMA_VERSION;
  activeSession: Session | null;
  history: Session[]; // ended sessions, newest-last for append efficiency
};

export const PLACEHOLDER_EXERCISE_ID = "placeholder";

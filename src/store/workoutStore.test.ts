import { createWorkoutStore, WorkoutStore } from "./workoutStore";
import { StoreApi } from "zustand/vanilla";

function freshStore(): StoreApi<WorkoutStore> {
  // No-op persist: exercise the store in pure form, no AsyncStorage.
  return createWorkoutStore(() => {});
}

describe("workoutStore", () => {
  describe("session lifecycle", () => {
    it("starts with no active session and empty history", () => {
      const store = freshStore();
      expect(store.getState().activeSession).toBeNull();
      expect(store.getState().history).toEqual([]);
    });

    it("startSession creates an active session with no exercises", () => {
      const store = freshStore();
      store.getState().startSession();
      const active = store.getState().activeSession;
      expect(active).not.toBeNull();
      expect(active?.endedAt).toBeNull();
      expect(active?.sessionExercises).toEqual([]);
      expect(typeof active?.startedAt).toBe("number");
    });

    it("throws when starting a session while one is already active", () => {
      const store = freshStore();
      store.getState().startSession();
      expect(() => store.getState().startSession()).toThrow();
    });

    it("endSession moves the active session to history with endedAt set", () => {
      const store = freshStore();
      store.getState().startSession();
      const startedId = store.getState().activeSession?.id;
      store.getState().endSession();
      expect(store.getState().activeSession).toBeNull();
      expect(store.getState().history).toHaveLength(1);
      const ended = store.getState().history[0];
      expect(ended.id).toBe(startedId);
      expect(typeof ended.endedAt).toBe("number");
    });

    it("throws when ending with no active session", () => {
      const store = freshStore();
      expect(() => store.getState().endSession()).toThrow();
    });
  });

  describe("addExerciseToSession", () => {
    it("appends exercises with sequential order", () => {
      const store = freshStore();
      store.getState().startSession();
      store.getState().addExerciseToSession("bench-press");
      store.getState().addExerciseToSession("squat");
      const exercises = store.getState().activeSession?.sessionExercises ?? [];
      expect(exercises).toHaveLength(2);
      expect(exercises[0].exerciseId).toBe("bench-press");
      expect(exercises[0].order).toBe(0);
      expect(exercises[1].exerciseId).toBe("squat");
      expect(exercises[1].order).toBe(1);
      expect(exercises[0].sets).toEqual([]);
    });
  });

  describe("removeExerciseFromSession", () => {
    it("removes the targeted exercise and all of its sets", () => {
      const store = freshStore();
      store.getState().startSession();
      store.getState().addExerciseToSession("bench-press");
      const seId = store.getState().activeSession!.sessionExercises[0].id;
      store.getState().logSet(seId, 8, 80);
      store.getState().logSet(seId, 8, 80);

      store.getState().removeExerciseFromSession(seId);

      expect(store.getState().activeSession!.sessionExercises).toEqual([]);
    });

    it("leaves sibling exercises and their sets intact", () => {
      const store = freshStore();
      store.getState().startSession();
      store.getState().addExerciseToSession("bench-press");
      store.getState().addExerciseToSession("squat");
      const [se1, se2] = store.getState().activeSession!.sessionExercises;
      store.getState().logSet(se2.id, 5, 100);

      store.getState().removeExerciseFromSession(se1.id);

      const remaining = store.getState().activeSession!.sessionExercises;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe(se2.id);
      expect(remaining[0].exerciseId).toBe("squat");
      expect(remaining[0].sets).toHaveLength(1);
    });
  });

  describe("logSet", () => {
    it("assigns sequential setNumber per session exercise", () => {
      const store = freshStore();
      store.getState().startSession();
      store.getState().addExerciseToSession("bench-press");
      const seId = store.getState().activeSession!.sessionExercises[0].id;

      store.getState().logSet(seId, 8, 80);
      store.getState().logSet(seId, 8, 82.5);
      store.getState().logSet(seId, 6, 85);

      const sets = store.getState().activeSession!.sessionExercises[0].sets;
      expect(sets.map((s) => s.setNumber)).toEqual([1, 2, 3]);
      expect(sets.map((s) => s.reps)).toEqual([8, 8, 6]);
      expect(sets.map((s) => s.weight)).toEqual([80, 82.5, 85]);
    });

    it("numbers sets independently for each session exercise", () => {
      const store = freshStore();
      store.getState().startSession();
      store.getState().addExerciseToSession("bench-press");
      store.getState().addExerciseToSession("squat");
      const [se1, se2] = store.getState().activeSession!.sessionExercises;

      store.getState().logSet(se1.id, 8, 80);
      store.getState().logSet(se2.id, 5, 100);
      store.getState().logSet(se2.id, 5, 100);

      const exercises = store.getState().activeSession!.sessionExercises;
      expect(exercises[0].sets.map((s) => s.setNumber)).toEqual([1]);
      expect(exercises[1].sets.map((s) => s.setNumber)).toEqual([1, 2]);
    });
  });

  describe("persistence seam", () => {
    it("persists a snapshot on every mutation", () => {
      const saved: unknown[] = [];
      const store = createWorkoutStore((state) => saved.push(state));
      store.getState().startSession();
      store.getState().addExerciseToSession("bench-press");
      expect(saved).toHaveLength(2);
      expect(saved[saved.length - 1]).toMatchObject({ schemaVersion: 1 });
    });
  });
});

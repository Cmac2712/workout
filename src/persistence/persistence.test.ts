import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadState, saveState, STORAGE_KEY } from "./persistence";
import { PersistedState, Session } from "../types";

function makeSession(id: string, ended: boolean): Session {
  return {
    id,
    startedAt: 1000,
    endedAt: ended ? 2000 : null,
    sessionExercises: [
      {
        id: `${id}-se1`,
        exerciseId: "bench-press",
        order: 0,
        sets: [
          { id: `${id}-s1`, setNumber: 1, reps: 8, weight: 80 },
          { id: `${id}-s2`, setNumber: 2, reps: 8, weight: 82.5 },
        ],
      },
    ],
  };
}

const emptyState: PersistedState = {
  schemaVersion: 1,
  activeSession: null,
  history: [],
  restDurationMs: 120_000,
};

const oneSessionState: PersistedState = {
  schemaVersion: 1,
  activeSession: null,
  history: [makeSession("a", true)],
  restDurationMs: 90_000,
};

const manySessionsState: PersistedState = {
  schemaVersion: 1,
  activeSession: null,
  history: [makeSession("a", true), makeSession("b", true), makeSession("c", true)],
  restDurationMs: 180_000,
};

const activeSessionState: PersistedState = {
  schemaVersion: 1,
  activeSession: makeSession("active", false),
  history: [makeSession("a", true)],
  restDurationMs: 120_000,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("persistence", () => {
  it("returns null when nothing is stored", async () => {
    expect(await loadState()).toBeNull();
  });

  it.each([
    ["empty", emptyState],
    ["one session", oneSessionState],
    ["many sessions", manySessionsState],
    ["active session present", activeSessionState],
  ])("round-trips %s state", async (_label, state) => {
    await saveState(state);
    expect(await loadState()).toEqual(state);
  });

  it("returns null (does not throw) on unparseable JSON", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "{ not json");
    await expect(loadState()).resolves.toBeNull();
  });

  it("returns null when schemaVersion is missing", async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ activeSession: null, history: [] })
    );
    expect(await loadState()).toBeNull();
  });

  it("returns null when schemaVersion is unknown", async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 99, activeSession: null, history: [] })
    );
    expect(await loadState()).toBeNull();
  });

  it("defaults restDurationMs for blobs written before the rest timer existed", async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, activeSession: null, history: [] })
    );
    const loaded = await loadState();
    expect(loaded?.restDurationMs).toBe(120_000);
  });
});

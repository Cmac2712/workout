import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_REST_DURATION_MS,
  PersistedState,
  SCHEMA_VERSION,
} from "../types";

export const STORAGE_KEY = "workout/state/v1";

export async function loadState(): Promise<PersistedState | null> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (raw == null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isPersistedState(parsed)) return null;

  // restDurationMs was added after the initial schema; default it for blobs
  // written before the rest timer existed (no version bump needed).
  return {
    ...parsed,
    restDurationMs:
      typeof parsed.restDurationMs === "number"
        ? parsed.restDurationMs
        : DEFAULT_REST_DURATION_MS,
  };
}

export async function saveState(state: PersistedState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isPersistedState(value: unknown): value is PersistedState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion !== SCHEMA_VERSION) return false;
  if (!Array.isArray(candidate.history)) return false;
  if (
    candidate.activeSession !== null &&
    typeof candidate.activeSession !== "object"
  ) {
    return false;
  }
  return true;
}

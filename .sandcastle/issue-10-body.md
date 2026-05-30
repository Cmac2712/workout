# Change app name to Stronger

**Triage label:** `ready-for-agent`

## Context

The app is currently called **"Workout"** (the working name from Slice 0). It needs a real product name: **Stronger**. This is a rename pass — user-visible name in the launcher, splash, and any titles that say "Workout" *as the app*, while leaving the "Workout" *tab/section name* (one of two tabs alongside "History") alone, since that's a section label, not the product name.

## Scope

### Must change (user-visible)

- [ ] [app.json](app.json) — `expo.name`: `"Workout"` → `"Stronger"`. Drives launcher label, splash title, and notification name.

### Should change (cosmetic / internal-but-visible)

- [ ] [package.json](package.json) — `"name": "workout"` → `"stronger"`. Pure npm-package name; cosmetic but worth aligning.
- [ ] [PRD.md](PRD.md) — title and prose ("Personal Workout Tracker" → keep the descriptor, but mention the product is now "Stronger").
- [ ] [README.md](README.md) (if present) — title.

### Decide before touching (each has a cost)

- [ ] [app.json](app.json) — `expo.slug` (`"workout"`). Changing the slug renames the Expo project URL. Existing EAS builds, push credentials, and the project linkage are tied to the slug — typically **leave as `workout`** unless we're prepared to re-create the EAS project.
- [ ] [app.json](app.json) — `android.package` (`"com.workout.app"`). Changing the Android package ID makes the new build install as a **separate app** alongside the old one and **loses all on-device AsyncStorage data**. For a single-user pre-launch app this may be acceptable; for an installed dev build with real session history, it's not. Propose: **leave as `com.workout.app`** and only revisit before any public release.
- [ ] [src/persistence/persistence.ts:4](src/persistence/persistence.ts#L4) — `STORAGE_KEY = "workout/state/v1"`. Do **not** change — would orphan all logged sessions on existing installs. The key is internal; users never see it.
- [ ] GitHub repo name (`workout` → `stronger`). Separate manual step on github.com; GitHub auto-redirects the old URL but local clones need `git remote set-url`. Out of scope for this issue unless explicitly asked.
- [ ] Local folder name (`/Users/craig/Sites/projects/workout`). Out of scope; user can rename when convenient.

### Do not change

- [src/navigation/RootNavigator.tsx:28](src/navigation/RootNavigator.tsx#L28) — screen `title: "Workout"`. This is the *active-session screen* header, which sits inside the "Workout" tab. Keep as-is (it's the section name, not the app name).
- [src/navigation/RootNavigator.tsx:60](src/navigation/RootNavigator.tsx#L60) — `<Tab.Screen name="Workout" ...>`. Same reasoning — the tab is "Workout" / "History"; the app is "Stronger".
- Component, store, file, type, and class names containing "Workout" / `workoutStore` / `WorkoutScreen` etc. — domain language, not branding.

## Acceptance Criteria

- [ ] Launching the app on Android shows **Stronger** as the launcher label and splash title.
- [ ] `expo.name` is `"Stronger"` in [app.json](app.json).
- [ ] No regression in build (`expo start`, `eas build --profile preview`) or tests (`npm test`, `npm run typecheck`).
- [ ] Existing AsyncStorage data (logged sessions on the dev build) survives the rename — i.e. `STORAGE_KEY` is unchanged and `android.package` is unchanged unless explicitly approved.
- [ ] The Workout/History tab labels and the active-session screen header are unchanged.

## Open Decisions

- **Change `android.package` now or later?** Recommend later, to preserve on-device session history.
- **Change `expo.slug` and re-link EAS?** Recommend no, to avoid disturbing the existing EAS project (`60e63661-…`).
- **Rename the GitHub repo?** Out of scope here — flag separately if wanted.

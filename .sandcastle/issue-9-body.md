# Add timer to workouts

**Triage label:** `ready-for-agent`

## Context

Slice 0 (PRD #1) explicitly shipped *without* a rest timer — "no rest timer" was a deliberate cut, deferred until real usage proved it was wanted. Total **session duration** is already captured (start/end timestamps, shown in the History list), so this issue is *not* about that. This is the **rest timer between sets**: after I log a set, I want a countdown so I know when to start the next one without staring at a wall clock.

## Problem

Between working sets I rest a fixed-ish amount of time (e.g. 90s–180s). Right now I either guess or use my phone's separate clock app, which means leaving the workout screen and losing my place. I want the timer to live inside the active session so resting is one glance, not a context switch.

## Solution

When I log a set, a rest timer starts counting down from a default duration. It's visible on the active-session screen, I can pause/resume/reset it, and adjust the duration. It keeps running (or shows correct elapsed time) even if I background the app or switch tabs.

## User Stories

1. As a lifter, I want a rest timer to start automatically when I log a set, so that I don't have to remember to tap "start" while catching my breath.
2. As a lifter, I want the timer visible on the active-session screen, so that I can see remaining rest at a glance without leaving the screen.
3. As a lifter, I want to pause, resume, and reset the timer, so that I stay in control when a set runs long or I want to rest more.
4. As a lifter, I want to set the rest duration, so that the countdown matches how I actually train (e.g. 90s for accessories, 3min for heavy compounds).
5. As a lifter, I want the timer to keep correct time when I background the app or switch to the History tab, so that resting isn't reset by normal phone use.
6. As a lifter, I want a clear signal when rest is up (visual, optionally haptic/sound), so that I notice it even when I've looked away.

## Acceptance Criteria

- [ ] Logging a set starts a countdown rest timer from the configured default.
- [ ] Timer is shown on the active-session screen (mm:ss), distinct from the always-running session duration.
- [ ] Pause, resume, and reset controls work and are reachable one-handed.
- [ ] Rest duration is adjustable; the chosen default persists across sessions (AsyncStorage, consistent with Slice 0).
- [ ] Timer reflects correct remaining time after the app is backgrounded/foregrounded and after switching tabs (compute from a stored target timestamp rather than relying on a JS interval surviving).
- [ ] Timer reaching zero produces a clear visual signal; haptic feedback if cheap to add on Android/Expo Go.
- [ ] No regression to set logging, session start/end, or history.
- [ ] kg/units and the two-tab layout are unchanged.

## Out of Scope

- Total workout-duration tracking (already exists).
- Per-exercise default rest times, auto-progression, or notifications when the app is fully closed.
- Background OS notifications / push — in-app timer only for this slice.

## Open Decisions

- **Default rest duration:** propose 120s as the starting default (adjustable).
- **Auto-start vs manual:** propose auto-start on set log, with a manual reset/skip. Open to manual-only if auto-start feels intrusive.
- **Sound/haptic:** Expo Go limits some native capabilities — start with visual + haptic (`expo-haptics`), defer sound if it needs extra config.

# PRD: Exercise Performance Converter PWA

## Overview

This Progressive Web App (PWA) allows users to convert their performance in one resistance exercise into an equivalent performance in another. The app estimates a user's 1RM (one-rep max) for a **reference exercise** based on user input, then uses predefined **conversion factors** to estimate the 1RM for a **target exercise**, and finally calculates the appropriate working weight for a desired number of reps in the target exercise.

## Target Audience

Strength trainees who:
- Track and plan their workouts.
- Use alternative exercises due to equipment or body constraints.
- Want intelligent load substitution based on performance.

## UX Flow

### Main Screen

- **Reference Exercise**
  - Dropdown menu (e.g., Bench Press, Incline Bench, Dumbbell Fly, etc.)
  - Input: Weight (lbs or kg)
  - Input: Number of reps

- **Target Exercise**
  - Dropdown menu (same list as above)
  - Input: Target number of reps
  - Output (readonly): Recommended weight

- **Advanced Section**
  - Button: `Import Config`
    - Loads a `config.json` file containing custom conversion factors and 1RM formula constants.

## Core Algorithm

### Step 1: Calculate 1RM for Reference Exercise

Use an adjustable formula of the type:

```
1RM = weight * (1 + reps / k)
```

Where `k` is configurable (e.g., Epley uses `k = 30`).

Default: `k = 30` (modifiable via config)

### Step 2: Convert Reference 1RM to Bench Press 1RM

Each upper-body exercise has a **conversion factor to bench press**. Each lower-body exercise has one to **squat**.

If the reference is not bench/squat itself:
```
bench_1RM = reference_1RM / toBenchFactor[reference]
```

If the reference is bench/squat:
```
bench_1RM = reference_1RM
```

### Step 3: Convert to Target Exercise 1RM

```
target_1RM = bench_1RM * toBenchFactor[target]
```

(Or use `toSquatFactor` for lower-body logic.)

### Step 4: Calculate Working Weight for Target Exercise

Using same 1RM formula (inverse):

```
target_weight = target_1RM / (1 + target_reps / k)
```

## Example

User can do:
- **12 reps at 145 lbs in Bench Press**

Wants to do:
- **5 reps of Dumbbell Fly**

Steps:
1. `1RM_bench = 145 * (1 + 12/30) = 202 lbs`
2. `1RM_fly = 202 * fly_to_bench_factor`
3. `target_weight = 1RM_fly / (1 + 5/30)`

## Data Model

### config.json structure:

```json
{
  "1rm_formula_k": 30,
  "toBenchFactors": {
    "bench_press": 1.0,
    "incline_bench": 0.85,
    "dumbbell_fly": 0.55,
    "overhead_press": 0.65,
    "pushup": 0.35
  },
  "toSquatFactors": {
    "squat": 1.0,
    "leg_press": 0.7,
    "lunge": 0.5,
    "step_up": 0.4
  }
}
```

### Defaults:
- Default `k = 30` (Epley)
- Default conversion factors included for common exercises
- If config not loaded, use built-in defaults

## Features

- PWA with offline support
- Mobile-friendly UI
- Import button for `config.json` with custom factors
- Read-only result output with visual formatting
- Clear error messages if reps or weights are invalid

## Future Enhancements (Not MVP)

- Save/load exercise presets
- Show historical conversions
- Graphical strength comparison
- Support for bodyweight exercises with modifiers

## Technical Requirements

- JavaScript/TypeScript
- IndexedDB (optional, for future saving)
- PWA manifest + service worker
- Responsive layout
- Framework: Vanilla JS or React (developer choice)

## File Placement

Place this file at:
```
/docs/PRD.md
```

Use it as a source of truth for logic and UI interactions.

# Exercise Performance Converter

A Progressive Web App (PWA) to convert your performance in one resistance exercise to an equivalent in another.

## Mobile Installation Instructions

### For iPhone (iOS)
1. Open the app URL in Safari: [Exercise Converter](https://denysy1.github.io/exercise-converter/).
2. Tap the Share icon at the bottom of the screen.
3. Scroll down and tap Add to Home Screen.
4. Tap Add in the top right corner. The app icon will appear on your home screen.

### For Android
1. Open the app URL in Chrome: [Exercise Converter](https://denysy1.github.io/exercise-converter/).
2. Tap the Menu icon (three vertical dots) in the top right corner.
3. Select Add to Home screen.
4. Tap Add and confirm. The app icon will now appear on your home screen.

Once installed, the app will work offline and behave like a native app.

## Custom Configuration
You can fine-tune the app by importing a `config.json` file. Example:
```json
{
  "1rm_formula_k": 30,
  "toBenchFactors": { "bench_press": 1.0, "incline_bench": 0.85 },
  "toSquatFactors": { "squat": 1.0, "leg_press": 0.7 }
}
```

# Cephraine

A prototype headache diary and 3D pain visualization app. Users can log daily headaches, select the location of pain on an interactive 3D head model, and export their logs for medical consultations.

## Tech Stack

- **React Native** with **Expo SDK 55** (iOS-focused)
- **Expo Router** for file-based navigation
- **React Three Fiber** + **Three.js** for 3D head model
- **Zustand** for state management with AsyncStorage persistence
- **TypeScript** throughout

## Getting Started

```bash
npm install
npm run web      # Start web dev server
npm run ios      # Start iOS (requires macOS + Xcode)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run web` | Start Expo dev server for web |
| `npm run ios` | Start Expo dev server for iOS |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run build:web` | Export for web deployment |

## Features

- **Headache Logging** — Record severity, type, duration, triggers, and notes
- **3D Pain Visualization** — Interactive 3D head model to select pain locations
- **History** — Browse and manage past headache entries
- **Export** — Download CSV or view summary for medical consultations

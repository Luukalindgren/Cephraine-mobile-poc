# Agents

## Cursor Cloud specific instructions

### Project Overview
Cephraine is an iOS-focused mobile headache diary PoC built with Expo SDK 55 + React Native + React Three Fiber. See `README.md` for full tech stack and available scripts.

### Running the App
- **Web dev mode**: `npm run web` (starts Expo on port 8081)
- **iOS**: `npm run ios` (requires macOS with Xcode)
- The 3D head model uses WebGL via react-three-fiber. In headless/no-GPU cloud VMs, the HeadModel3D component falls back to a chip-based region picker.

### Key Commands
| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server (web) | `npm run web` |
| Lint | `npm run lint` |
| Tests | `npm test` |
| TypeScript check | `npx tsc --noEmit` |
| Build for web | `npm run build:web` |

### Gotchas
- `babel.config.js` includes `unstable_transformImportMeta: true` — required for three.js ES module imports to work with Metro bundler.
- Jest needs `transformIgnorePatterns` to handle ESM packages like `uuid`. This is configured in `package.json` under `jest`.
- The `expo-file-system` dynamic import in `export.tsx` uses `any` type because the module structure differs between web and native at import time.
- `react-native-worklets` is a required dependency for `react-native-reanimated` v4.
- When adding new npm packages, use `--legacy-peer-deps` if you encounter peer dependency conflicts with React 19 / react-three-fiber.

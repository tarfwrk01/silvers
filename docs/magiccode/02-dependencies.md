# Dependencies Installation Guide

This guide covers all the packages you need to install for the InstantDB + Magic Code Authentication setup.

## Core Dependencies

### InstantDB and Required Peer Dependencies

```bash
# InstantDB React Native package
npm install @instantdb/react-native

# Required peer dependencies for InstantDB
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
npm install react-native-get-random-values
```

**Why these are needed:**
- `@instantdb/react-native`: The main InstantDB client for React Native
- `@react-native-async-storage/async-storage`: For storing authentication tokens locally
- `@react-native-community/netinfo`: For network connectivity detection
- `react-native-get-random-values`: Provides crypto.getRandomValues() polyfill

### Expo Router and Navigation

```bash
# Expo Router for file-based routing
npx expo install expo-router

# Required dependencies for Expo Router
npx expo install react-native-safe-area-context
npx expo install react-native-screens
npx expo install expo-linking
npx expo install expo-constants
npx expo install expo-status-bar
```

**Why these are needed:**
- `expo-router`: File-based routing system for React Native
- `react-native-safe-area-context`: Handles safe area insets
- `react-native-screens`: Native screen management
- `expo-linking`: Deep linking support
- `expo-constants`: Access to system constants
- `expo-status-bar`: Status bar configuration

### UI and Icons

```bash
# Vector icons for tab navigation
npx expo install @expo/vector-icons
```

## Complete Package.json Dependencies

After installation, your `package.json` should include these dependencies:

```json
{
  "dependencies": {
    "@expo/vector-icons": "^14.1.0",
    "@instantdb/react-native": "^0.19.18",
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-native-community/netinfo": "^11.4.1",
    "expo": "~53.0.10",
    "expo-constants": "~17.1.6",
    "expo-linking": "~7.1.5",
    "expo-router": "~5.0.7",
    "expo-status-bar": "~2.2.3",
    "react": "19.0.0",
    "react-native": "0.79.3",
    "react-native-get-random-values": "^1.11.0",
    "react-native-safe-area-context": "5.4.0",
    "react-native-screens": "~4.11.1",
    "typescript": "~5.8.3"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.0.10",
    "typescript": "~5.8.3"
  }
}
```

## Installation Commands Summary

Run these commands in order:

```bash
# 1. Core InstantDB setup
npm install @instantdb/react-native @react-native-async-storage/async-storage @react-native-community/netinfo react-native-get-random-values

# 2. Expo Router setup
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# 3. UI dependencies
npx expo install @expo/vector-icons

# 4. Verify installation
npm ls
```

## Version Compatibility

This template is tested with:
- **Expo SDK**: 53.x
- **React Native**: 0.79.x
- **React**: 19.x
- **TypeScript**: 5.8.x
- **InstantDB**: 0.19.x

## Optional Dependencies

You may want to add these depending on your app needs:

```bash
# For additional UI components
npx expo install expo-blur

# For haptic feedback
npx expo install expo-haptics

# For image handling
npx expo install expo-image

# For web browser functionality
npx expo install expo-web-browser
```

## Troubleshooting Dependencies

### Common Issues:

1. **Peer dependency warnings**: These are usually safe to ignore if versions are compatible
2. **Metro bundler issues**: Clear cache with `npx expo start --clear`
3. **iOS build issues**: Run `npx pod-install` if using bare React Native
4. **Android build issues**: Clean and rebuild with `npx expo run:android --clear`

### Checking Installation:

```bash
# Check if all packages are installed correctly
npm ls @instantdb/react-native
npm ls expo-router
npm ls @react-native-async-storage/async-storage

# Check for any missing peer dependencies
npm ls --depth=0
```

---

**Next**: Continue to `03-configuration.md` for environment setup.

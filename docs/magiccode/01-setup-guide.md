# Step-by-Step Setup Guide

Follow these steps to create a new React Native app with InstantDB and magic code authentication.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- A code editor (VS Code recommended)

## Step 1: Create New Expo App

```bash
# Create a new Expo app with TypeScript template
npx create-expo-app@latest MyAppName --template blank-typescript

# Navigate to the project directory
cd MyAppName
```

## Step 2: Install Dependencies

See `02-dependencies.md` for the complete list of packages to install.

```bash
# Install InstantDB and required peer dependencies
npm install @instantdb/react-native @react-native-async-storage/async-storage @react-native-community/netinfo react-native-get-random-values

# Install Expo Router and navigation dependencies
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Install additional UI dependencies
npx expo install @expo/vector-icons
```

## Step 3: Configure Expo Router

Update your `app.json` to enable Expo Router:

```json
{
  "expo": {
    "scheme": "your-app-name",
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

Update `package.json` main entry:

```json
{
  "main": "expo-router/entry"
}
```

## Step 4: Set Up InstantDB Account

1. Go to [https://www.instantdb.com/dash](https://www.instantdb.com/dash)
2. Create a new account or sign in
3. Create a new app
4. Copy your App ID (you'll need this for configuration)
5. Enable Magic Code authentication in the Auth section

## Step 5: Create Project Structure

Create the following folder structure in your project:

```
your-app/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── profile.tsx
│   │   └── settings.tsx
│   ├── _layout.tsx
│   └── index.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── instant.ts
├── components/
│   └── (optional additional components)
├── polyfills.ts
└── .env
```

## Step 6: Copy Code Files

Copy all the code files from the `04-code-files/` directory in this template to your project, maintaining the same folder structure.

## Step 7: Configure Environment Variables

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_INSTANT_APP_ID=your-actual-app-id-here
```

Replace `your-actual-app-id-here` with the App ID you copied from InstantDB dashboard.

## Step 8: Test the Application

```bash
# Start the development server
npx expo start

# Test on your device using Expo Go app
# Or run on simulator/emulator
npx expo start --ios    # for iOS simulator
npx expo start --android # for Android emulator
```

## Step 9: Verify Magic Code Flow

1. The app should show a login screen
2. Enter your email address
3. Check your email for the magic code
4. Enter the code to authenticate
5. You should be redirected to the home tab screen

## Next Steps

- Customize the UI to match your app's design
- Add your app's specific features and screens
- Configure additional InstantDB features (real-time data, etc.)
- Set up app icons and splash screens
- Prepare for app store deployment

---

**Troubleshooting**: If you encounter issues, check `05-troubleshooting.md` for common problems and solutions.

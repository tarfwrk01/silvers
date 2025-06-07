# Configuration Guide

This guide covers all the configuration files you need to set up for the InstantDB + Magic Code Authentication template.

## 1. App Configuration (app.json)

Update your `app.json` file to enable Expo Router and configure your app:

```json
{
  "expo": {
    "name": "your-app-name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "your-app-scheme",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

**Key configurations:**
- `scheme`: Used for deep linking (change to your app name)
- `plugins`: Includes `expo-router` for file-based routing
- `experiments.typedRoutes`: Enables TypeScript route typing

## 2. Package.json Configuration

Update your `package.json` main entry point:

```json
{
  "name": "your-app-name",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  }
}
```

**Important**: The `main` field must be set to `"expo-router/entry"` for Expo Router to work.

## 3. Environment Variables (.env)

Create a `.env` file in your project root:

```env
# InstantDB Configuration
EXPO_PUBLIC_INSTANT_APP_ID=your-actual-app-id-here

# Optional: Add other environment variables
# EXPO_PUBLIC_API_URL=https://your-api.com
# EXPO_PUBLIC_APP_ENV=development
```

**Getting your InstantDB App ID:**
1. Go to [https://www.instantdb.com/dash](https://www.instantdb.com/dash)
2. Create an account or sign in
3. Create a new app
4. Copy the App ID from your dashboard
5. Replace `your-actual-app-id-here` with your actual App ID

## 4. TypeScript Configuration (tsconfig.json)

Ensure your `tsconfig.json` includes proper Expo Router configuration:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

## 5. Polyfills Configuration

Create `polyfills.ts` in your project root:

```typescript
// Required polyfills for @instantdb/react-native
import 'react-native-get-random-values';
```

This file provides necessary polyfills for InstantDB to work properly in React Native.

## 6. InstantDB Dashboard Configuration

### Enable Magic Code Authentication:

1. **Login to InstantDB Dashboard**:
   - Go to [https://www.instantdb.com/dash](https://www.instantdb.com/dash)
   - Sign in to your account

2. **Select Your App**:
   - Choose the app you created
   - Navigate to the "Auth" section

3. **Enable Magic Code**:
   - Toggle on "Magic Code" authentication
   - Configure email settings (optional - uses InstantDB's default email service)

4. **Optional Email Configuration**:
   - Set up custom email templates
   - Configure your own SMTP server (for production apps)
   - Customize the magic code email appearance

### Security Settings:

- **Magic Code Expiry**: Default is 10 minutes (recommended)
- **Rate Limiting**: Enabled by default to prevent spam
- **Domain Restrictions**: Add your domains for production

## 7. Metro Configuration (metro.config.js)

If you encounter any bundling issues, create or update `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

## 8. Babel Configuration (babel.config.js)

Ensure your `babel.config.js` includes the Expo preset:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for react-native-reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
```

## 9. Git Configuration (.gitignore)

Make sure your `.gitignore` includes:

```gitignore
# Environment variables
.env
.env.local
.env.production

# Expo
.expo/
dist/
web-build/

# Dependencies
node_modules/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

**Important**: Never commit your `.env` file with real API keys to version control.

## 10. Verification Checklist

After configuration, verify everything is set up correctly:

- [ ] `app.json` includes `expo-router` plugin
- [ ] `package.json` main entry is `expo-router/entry`
- [ ] `.env` file contains your InstantDB App ID
- [ ] `polyfills.ts` is created and imports required polyfills
- [ ] InstantDB dashboard has Magic Code authentication enabled
- [ ] All dependencies are installed correctly

## Environment-Specific Configuration

### Development:
```env
EXPO_PUBLIC_INSTANT_APP_ID=your-dev-app-id
EXPO_PUBLIC_APP_ENV=development
```

### Production:
```env
EXPO_PUBLIC_INSTANT_APP_ID=your-prod-app-id
EXPO_PUBLIC_APP_ENV=production
```

---

**Next**: Continue to `04-code-files/` to copy all the necessary code files.

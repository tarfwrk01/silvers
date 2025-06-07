# Quick Start Guide - One-Click Setup

This is the fastest way to set up a new React Native app with InstantDB + Magic Code Authentication.

## 🚀 One-Click Commands

Copy and paste these commands to set up everything:

### 1. Create Project & Install Dependencies

```bash
# Create new Expo app
npx create-expo-app@latest MyApp --template blank-typescript
cd MyApp

# Install all dependencies at once
npm install @instantdb/react-native @react-native-async-storage/async-storage @react-native-community/netinfo react-native-get-random-values
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar @expo/vector-icons
```

### 2. Update Configuration Files

**package.json** - Change main entry:
```json
{
  "main": "expo-router/entry"
}
```

**app.json** - Add to expo object:
```json
{
  "expo": {
    "scheme": "myapp",
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### 3. Create Environment File

Create `.env` in project root:
```env
EXPO_PUBLIC_INSTANT_APP_ID=your-app-id-here
```

### 4. Copy All Code Files

Copy the entire folder structure from `docs/magiccode/04-code-files/` to your project root, maintaining the same structure.

### 5. Get InstantDB App ID

1. Go to [https://www.instantdb.com/dash](https://www.instantdb.com/dash)
2. Create account → Create new app → Copy App ID
3. Enable Magic Code authentication in Auth section
4. Replace `your-app-id-here` in `.env` with your actual App ID

### 6. Test the App

```bash
npx expo start
```

## 📁 Required File Structure

After copying files, your project should look like this:

```
MyApp/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── home.tsx
│       ├── profile.tsx
│       └── settings.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── instant.ts
├── polyfills.ts
├── .env
├── app.json
└── package.json
```

## ✅ Verification Checklist

- [ ] All dependencies installed without errors
- [ ] `package.json` main entry is `expo-router/entry`
- [ ] `app.json` includes expo-router plugin
- [ ] `.env` file contains your InstantDB App ID
- [ ] All code files copied to correct locations
- [ ] InstantDB dashboard has Magic Code auth enabled
- [ ] App starts without errors
- [ ] Login screen appears
- [ ] Magic code email received and verification works

## 🎯 What You Get

After setup, your app will have:

- ✅ **Email + Magic Code Authentication**
- ✅ **Automatic login persistence**
- ✅ **Protected routes with auth guards**
- ✅ **Tab navigation (Home, Profile, Settings)**
- ✅ **Clean login/signup flow**
- ✅ **Loading states and error handling**
- ✅ **TypeScript support**
- ✅ **Responsive design**

## 🔧 Customization

After the basic setup works:

1. **Update app name and scheme** in `app.json`
2. **Customize UI colors** in the StyleSheet objects
3. **Add your app's features** to the tab screens
4. **Configure app icons** and splash screens
5. **Add additional screens** as needed

## 🆘 If Something Goes Wrong

1. **Clear cache**: `npx expo start --clear`
2. **Reinstall dependencies**: `rm -rf node_modules && npm install`
3. **Check troubleshooting guide**: `05-troubleshooting.md`
4. **Verify file structure** matches exactly as shown above

## 📱 Testing Flow

1. App launches → Shows loading spinner
2. Not authenticated → Redirects to login screen
3. Enter email → Receive magic code email
4. Enter code → Authenticated and redirected to home tab
5. Navigate between tabs → Profile has sign out button
6. Sign out → Returns to login screen

---

**That's it!** You now have a fully functional React Native app with authentication ready for your custom features.

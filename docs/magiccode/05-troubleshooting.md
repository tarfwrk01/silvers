# Troubleshooting Guide

Common issues and solutions when setting up InstantDB with magic code authentication.

## Installation Issues

### 1. Peer Dependency Warnings

**Problem**: npm shows peer dependency warnings during installation.

**Solution**: These are usually safe to ignore if versions are compatible. If you want to resolve them:

```bash
# Install exact peer dependencies
npm install @react-native-async-storage/async-storage@^2.2.0
npm install @react-native-community/netinfo@^11.4.1
npm install react-native-get-random-values@^1.11.0
```

### 2. Metro Bundler Issues

**Problem**: "Unable to resolve module" errors or bundling failures.

**Solutions**:
```bash
# Clear Metro cache
npx expo start --clear

# Reset project completely
rm -rf node_modules
npm install
npx expo start --clear
```

### 3. Expo Router Not Working

**Problem**: File-based routing not working, screens not found.

**Solutions**:
- Ensure `package.json` has `"main": "expo-router/entry"`
- Check `app.json` includes `"expo-router"` in plugins
- Verify folder structure matches exactly:
  ```
  app/
  ├── _layout.tsx
  ├── index.tsx
  ├── (auth)/
  └── (tabs)/
  ```

## Authentication Issues

### 4. Magic Code Not Received

**Problem**: Users don't receive magic code emails.

**Solutions**:
- Check spam/junk folder
- Verify email address is correct (no typos)
- Ensure Magic Code auth is enabled in InstantDB dashboard
- Check InstantDB dashboard logs for delivery status
- For production: configure custom SMTP in InstantDB settings

### 5. "Cannot convert undefined value to object" Error

**Problem**: Error appears during app initialization.

**Solution**: This is expected during initial load. The error should resolve once InstantDB initializes. If it persists:
- Verify your App ID is correct in `.env`
- Check network connectivity
- Ensure polyfills are imported in `_layout.tsx`

### 6. Authentication State Not Persisting

**Problem**: Users get logged out when app restarts.

**Solutions**:
- Ensure `@react-native-async-storage/async-storage` is installed
- Check that polyfills are imported before InstantDB initialization
- Verify no conflicting storage libraries

## Environment Issues

### 7. Environment Variables Not Working

**Problem**: `process.env.EXPO_PUBLIC_INSTANT_APP_ID` returns undefined.

**Solutions**:
- Ensure `.env` file is in project root
- Variable name must start with `EXPO_PUBLIC_`
- Restart development server after changing `.env`
- Check `.env` file has no extra spaces or quotes

### 8. TypeScript Errors

**Problem**: TypeScript compilation errors.

**Solutions**:
```bash
# Ensure TypeScript is installed
npm install typescript@~5.8.3

# Check tsconfig.json extends expo base
# Restart TypeScript server in VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

## Navigation Issues

### 9. Redirect Loops

**Problem**: App gets stuck in redirect loops between auth and main screens.

**Solutions**:
- Check authentication guards in `_layout.tsx` files
- Ensure `useAuth()` is called within `AuthProvider`
- Verify loading states are handled properly

### 10. Tab Navigation Not Showing

**Problem**: Tab bar doesn't appear or tabs don't work.

**Solutions**:
- Ensure `@expo/vector-icons` is installed
- Check that user is authenticated before accessing tabs
- Verify tab screen files exist and export default components

## Platform-Specific Issues

### 11. iOS Simulator Issues

**Problem**: App doesn't work on iOS simulator.

**Solutions**:
```bash
# Reset iOS simulator
npx expo start --ios --clear

# If using bare React Native:
cd ios && pod install && cd ..
```

### 12. Android Emulator Issues

**Problem**: App crashes or doesn't load on Android.

**Solutions**:
```bash
# Clear Android build
npx expo start --android --clear

# If using bare React Native:
cd android && ./gradlew clean && cd ..
```

## Production Issues

### 13. Magic Code Emails in Production

**Problem**: Magic codes work in development but not production.

**Solutions**:
- Configure custom SMTP in InstantDB dashboard
- Set up proper email templates
- Configure domain authentication (SPF, DKIM)
- Monitor email delivery rates

### 14. App Store Submission Issues

**Problem**: App rejected due to authentication flow.

**Solutions**:
- Ensure proper error handling for network failures
- Add loading states for all auth operations
- Implement proper accessibility labels
- Test offline behavior

## Debugging Tips

### Enable Debug Logging

Add to your `lib/instant.ts`:
```typescript
const db = init({
  appId: APP_ID,
  // Add for debugging
  debug: __DEV__,
});
```

### Check InstantDB Dashboard

1. Go to your app dashboard
2. Check "Logs" section for authentication attempts
3. Monitor "Users" section for successful signups
4. Review "Auth" settings for configuration issues

### Network Debugging

```typescript
// Add to your auth functions for debugging
console.log('Sending magic code to:', email);
console.log('Verifying code:', code);
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid app ID" | Wrong App ID in .env | Check InstantDB dashboard |
| "Network request failed" | No internet connection | Check device connectivity |
| "Invalid magic code" | Wrong/expired code | Request new code |
| "Rate limit exceeded" | Too many requests | Wait before retrying |

## Getting Help

If you're still experiencing issues:

1. **Check InstantDB Documentation**: [https://docs.instantdb.com](https://docs.instantdb.com)
2. **InstantDB Discord**: Join their community for support
3. **GitHub Issues**: Check Expo Router and InstantDB repositories
4. **Stack Overflow**: Search for similar issues

## Useful Commands

```bash
# Complete reset
rm -rf node_modules .expo
npm install
npx expo start --clear

# Check package versions
npm ls @instantdb/react-native
npm ls expo-router

# Update packages
npx expo install --fix

# Check Expo diagnostics
npx expo doctor
```

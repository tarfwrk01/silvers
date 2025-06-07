# Complete File Structure Reference

This document shows the complete file structure and what each file does in the InstantDB + Magic Code Authentication template.

## 📁 Documentation Structure

```
docs/magiccode/
├── README.md                    # Overview and introduction
├── 01-setup-guide.md           # Detailed step-by-step setup
├── 02-dependencies.md          # Package installation guide
├── 03-configuration.md         # Environment and config setup
├── 04-code-files/              # All code files to copy
├── 05-troubleshooting.md       # Common issues and solutions
├── QUICK-START.md              # One-click setup commands
└── FILE-STRUCTURE.md           # This file
```

## 📁 Code Files Structure

```
04-code-files/
├── .env.example                # Environment variables template
├── polyfills.ts               # Required polyfills for InstantDB
├── lib/
│   └── instant.ts             # InstantDB configuration
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── app/
│   ├── _layout.tsx            # Root layout with AuthProvider
│   ├── index.tsx              # Main entry point with auth routing
│   ├── (auth)/                # Authentication screens group
│   │   ├── _layout.tsx        # Auth layout with redirect guards
│   │   ├── login.tsx          # Login screen with magic code flow
│   │   └── signup.tsx         # Signup screen with magic code flow
│   └── (tabs)/                # Authenticated app screens group
│       ├── _layout.tsx        # Tab navigation layout
│       ├── home.tsx           # Home tab screen
│       ├── profile.tsx        # Profile tab with sign out
│       └── settings.tsx       # Settings tab screen
```

## 🔍 File Descriptions

### Core Configuration Files

| File | Purpose | Key Features |
|------|---------|--------------|
| `polyfills.ts` | Required polyfills | Imports `react-native-get-random-values` |
| `.env.example` | Environment template | Shows required environment variables |
| `lib/instant.ts` | InstantDB setup | Initializes InstantDB with App ID |

### Authentication System

| File | Purpose | Key Features |
|------|---------|--------------|
| `contexts/AuthContext.tsx` | Auth state management | useAuth hook, magic code functions |
| `app/(auth)/_layout.tsx` | Auth screens layout | Redirects authenticated users |
| `app/(auth)/login.tsx` | Login screen | Email → Magic code → Verify flow |
| `app/(auth)/signup.tsx` | Signup screen | Same flow as login, different UI text |

### Main Application

| File | Purpose | Key Features |
|------|---------|--------------|
| `app/_layout.tsx` | Root layout | AuthProvider wrapper, polyfills import |
| `app/index.tsx` | Entry point | Auth-based routing logic |
| `app/(tabs)/_layout.tsx` | Tab navigation | Protected routes, tab configuration |
| `app/(tabs)/home.tsx` | Home screen | Welcome message with user email |
| `app/(tabs)/profile.tsx` | Profile screen | User info and sign out button |
| `app/(tabs)/settings.tsx` | Settings screen | Placeholder for app settings |

## 🎯 Key Features by File

### Authentication Flow (`AuthContext.tsx`)
- `signInWithMagicCode(email)` - Sends magic code to email
- `verifyMagicCode(email, code)` - Verifies code and signs in
- `signOut()` - Signs out user
- `user` - Current user object or null
- `isLoading` - Loading state for auth operations

### Routing Logic (`app/index.tsx`)
- Shows loading spinner while checking auth
- Redirects to `/(tabs)/home` if authenticated
- Redirects to `/(auth)/login` if not authenticated

### Protected Routes (`app/(tabs)/_layout.tsx`)
- Automatically redirects unauthenticated users
- Tab navigation with Home, Profile, Settings
- Ionicons for tab icons

### Magic Code Screens (`login.tsx`, `signup.tsx`)
- Two-step process: email → code
- Input validation and error handling
- Loading states during API calls
- Navigation between login/signup

## 🔧 Customization Points

### Easy to Customize
- **Colors**: Update StyleSheet color values
- **App name**: Change in `app.json` and text strings
- **Tab icons**: Modify Ionicons in `_layout.tsx`
- **Screen content**: Add features to tab screens

### Requires More Work
- **Additional auth methods**: Extend AuthContext
- **Database operations**: Add InstantDB queries
- **Push notifications**: Integrate with Expo notifications
- **Deep linking**: Configure URL schemes

## 📱 User Flow

1. **App Launch** (`app/index.tsx`)
   - Check authentication status
   - Show loading spinner

2. **Not Authenticated** (`app/(auth)/`)
   - Show login screen
   - User enters email
   - Magic code sent to email
   - User enters code
   - Authentication successful

3. **Authenticated** (`app/(tabs)/`)
   - Redirect to home tab
   - Access to all tab screens
   - Sign out from profile

## 🛠 Development Workflow

### For New Projects
1. Copy all files from `04-code-files/`
2. Update `package.json` and `app.json`
3. Install dependencies
4. Configure InstantDB App ID
5. Test authentication flow

### For Existing Projects
1. Install required dependencies
2. Copy and adapt code files
3. Update routing structure
4. Migrate existing auth logic

## 📋 Dependencies Used

### Core Dependencies
- `@instantdb/react-native` - Database and auth
- `expo-router` - File-based routing
- `@expo/vector-icons` - Tab icons

### Required Peer Dependencies
- `@react-native-async-storage/async-storage`
- `@react-native-community/netinfo`
- `react-native-get-random-values`

### Expo Dependencies
- `react-native-safe-area-context`
- `react-native-screens`
- `expo-linking`
- `expo-constants`
- `expo-status-bar`

## 🎨 UI/UX Features

- **Consistent Design**: iOS-style design system
- **Loading States**: Spinners during auth operations
- **Error Handling**: User-friendly error messages
- **Responsive**: Works on different screen sizes
- **Accessibility**: Proper labels and navigation
- **Keyboard Handling**: KeyboardAvoidingView for forms

---

This template provides a solid foundation for any React Native app requiring user authentication with minimal setup time.

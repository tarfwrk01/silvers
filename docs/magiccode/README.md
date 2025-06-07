# InstantDB + Magic Code Authentication + Expo Router Template

This is a complete template for setting up a React Native app with:
- **InstantDB** for backend and database
- **Magic Code Authentication** for passwordless login
- **Expo Router** for file-based navigation
- **TypeScript** support

## 📁 Template Structure

```
docs/magiccode/
├── README.md                    # This overview file
├── 01-setup-guide.md           # Step-by-step setup instructions
├── 02-dependencies.md          # Package installation guide
├── 03-configuration.md         # Environment and config setup
├── 04-code-files/              # All code files to copy
│   ├── lib/                    # InstantDB configuration
│   ├── contexts/               # Authentication context
│   ├── app/                    # Expo Router screens
│   └── components/             # Reusable components
└── 05-troubleshooting.md       # Common issues and solutions
```

## 🚀 Quick Start

1. **Create new Expo app**: `npx create-expo-app@latest MyApp --template blank-typescript`
2. **Follow setup guide**: Read `01-setup-guide.md` for complete instructions
3. **Copy code files**: Use files from `04-code-files/` directory
4. **Configure InstantDB**: Get your app ID and update environment variables
5. **Test the app**: Run and verify magic code authentication works

## ✨ Features Included

- ✅ Magic code email authentication
- ✅ Automatic login persistence
- ✅ Protected routes with authentication guards
- ✅ Tab navigation for authenticated users
- ✅ Clean login/signup flow
- ✅ Loading states and error handling
- ✅ TypeScript support throughout
- ✅ Responsive design

## 📱 App Flow

1. **App Launch** → Check authentication status
2. **Not Authenticated** → Redirect to login screen
3. **Login/Signup** → Enter email → Receive magic code → Verify code
4. **Authenticated** → Access tab navigation (Home, Profile, Settings)
5. **Sign Out** → Return to login screen

## 🎯 Perfect For

- MVP development
- Rapid prototyping
- Apps requiring simple authentication
- Projects needing real-time database features
- Teams wanting to avoid backend setup

---

**Next Step**: Start with `01-setup-guide.md` for detailed instructions.

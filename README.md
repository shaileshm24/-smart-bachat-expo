# SmartBachat - Expo Version

This is the Expo version of the SmartBachat app, created for easier development and testing.

## Features

- ✅ All core components migrated from the original React Native project
- ✅ Dashboard, Expenses, Goals, Coach, and More screens
- ✅ **NEW: Login & Register screens with backend API integration** 🔐
- ✅ **NEW: Bank Account Consent screen (Account Aggregator)** 🏦
- ✅ **NEW: Complete authentication flow** 🚀
- ✅ React Native Paper UI components
- ✅ Lucide React Native icons
- ✅ TypeScript support
- ✅ Easy to run on iOS, Android, and Web

## Getting Started

### Prerequisites

- Node.js >= 20
- Expo Go app on your phone (for testing on device)

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Scan QR Code

After running `npm start`, scan the QR code with:
- **iOS**: Camera app
- **Android**: Expo Go app

## Project Structure

```
smart-bachat-expo/
├── components/          # All UI components
│   ├── Dashboard.tsx
│   ├── Expenses.tsx
│   ├── Goals.tsx
│   ├── Coach.tsx
│   ├── More.tsx
│   ├── LoginScreen.tsx      # 🆕 Login screen
│   ├── RegisterScreen.tsx   # 🆕 Register screen
│   ├── ConsentScreen.tsx    # 🆕 Bank consent screen
│   ├── SplashScreen.tsx
│   ├── LoadingScreen.tsx
│   ├── ErrorScreen.tsx
│   └── ui/                  # Reusable UI components
├── contexts/                # 🆕 React contexts
│   └── AuthContext.tsx      # Authentication context
├── services/                # 🆕 API services
│   └── api.ts               # Backend API integration
├── App.tsx                  # Main app entry with navigation
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── INTEGRATION_GUIDE.md     # 🆕 API integration docs
```

## Removing Expo (For Production)

When you're ready to go to production without Expo:

### Option 1: Expo Prebuild (Recommended)
```bash
npx expo pnpx exd
```
This generates native iOS and Android folders while keeping Expo SDK features.

### Option 2: Full E### Option 2: h
npx expo eject
```
This completThis compls Expo aThis completThis compls Expo aThis completThis cptThis completThis comioThis completThis compls Ek to a bare React Native project (like the original smart-bachat-frontend).

## Core Components

All components from the original project have been migrated and enhanced:

### Authentication Flow 🔐
- **LoginScreen**: Email/password login with backend integration
- **RegisterScreen**: User registration with validation
- **ConsentScreen**: Bank account connection via Account Aggregator

### Main App Features 💰
- **Dashboard**: Overview with savings summary and quick actions
- **Expenses**: Track and categorize expenses
- **Goals**: Set and monitor savings goals with AI predictions
- **Coach**: AI-powered financial advice
- **More**: Settings and additional features

### Utility Screens 🛠️
- **SplashScreen**: App launch animation
- **LoadingScreen**: Loading states with messages
- **ErrorScreen**: Error handling with retry options

## Backend Integration 🔌

This app integrates with the SmartBachat Java backend service:

### API Endpoints Used
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/bank/connect` - Initiate bank connection
- `GET /api/v1/bank/accounts` - Get connected accounts

### Configuration
Update the API base URL in `services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080'; // Your backend URL
```

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for detailed documentation.

## Dependencies

- `expo`: Development platform
- `react-native-paper`: Material Design components
- `lucide-react-native`: Icon library
- `react-native-svg`: SVG support
- `react-native-safe-area-context`: Safe area handling

## Notes

- This version uses Expo for easier development
- All core functionality from the original app is preserved
- You can develop and test without Xcode or Android Studio setup
- When ready for production, you can remove Expo dependency

## License

Private

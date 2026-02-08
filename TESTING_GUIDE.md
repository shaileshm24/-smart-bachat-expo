# Testing Guide 🧪

## Overview

This guide covers all testing aspects of the SmartBachat Expo application, including unit tests, integration tests, and end-to-end testing strategies.

## Test Structure

```
__tests__/
├── services/
│   ├── api.test.ts              # API client and storage tests
│   └── deepLinking.test.ts      # Deep linking service tests
├── contexts/
│   └── AuthContext.test.tsx     # Authentication context tests
└── integration/
    └── authFlow.test.tsx        # Full authentication flow tests
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- api.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should login user"
```

## Test Coverage

Current coverage targets:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

View coverage report:
```bash
npm test -- --coverage --coverageReporters=html
open coverage/index.html
```

## Test Categories

### 1. Unit Tests

#### API Service Tests (`__tests__/services/api.test.ts`)
- ✅ Storage operations (set, get, remove, clear)
- ✅ API requests (POST, GET, PUT, DELETE)
- ✅ Authentication headers
- ✅ Error handling
- ✅ Automatic token refresh on 401

#### Deep Linking Tests (`__tests__/services/deepLinking.test.ts`)
- ✅ URL parsing (custom schemes and HTTPS)
- ✅ Handler registration and execution
- ✅ Query parameter extraction
- ✅ URL creation
- ✅ External URL opening

#### Auth Context Tests (`__tests__/contexts/AuthContext.test.tsx`)
- ✅ Context provider setup
- ✅ Login/logout functionality
- ✅ Authentication state management
- ✅ Token persistence
- ✅ Error handling

### 2. Integration Tests

#### Authentication Flow (`__tests__/integration/authFlow.test.tsx`)
- ✅ Login screen rendering and interaction
- ✅ Registration form validation
- ✅ Bank consent flow
- ✅ Navigation between screens
- ✅ API integration
- ✅ Error states

## Writing New Tests

### Test Template

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MyComponent } from '../components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });

  test('should handle user interaction', async () => {
    const onPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPress} />);
    
    fireEvent.press(getByText('Button'));
    
    await waitFor(() => {
      expect(onPress).toHaveBeenCalled();
    });
  });
});
```

### Mocking API Calls

```typescript
jest.mock('../services/api', () => ({
  authApi: {
    login: jest.fn(),
  },
}));

// In test
const { authApi } = require('../services/api');
authApi.login.mockResolvedValueOnce({ status: 'SUCCESS' });
```

### Testing Async Operations

```typescript
test('should handle async operation', async () => {
  const { getByText, findByText } = render(<MyComponent />);
  
  fireEvent.press(getByText('Load Data'));
  
  const result = await findByText('Data Loaded');
  expect(result).toBeTruthy();
});
```

## Manual Testing Checklist

### Authentication Flow
- [ ] Splash screen displays for 2 seconds
- [ ] Loading screen displays for 1.5 seconds
- [ ] Login screen appears
- [ ] Can toggle password visibility
- [ ] Login with valid credentials succeeds
- [ ] Login with invalid credentials shows error
- [ ] Can navigate to register screen
- [ ] Registration form validates all fields
- [ ] Password confirmation works
- [ ] Successful registration navigates to consent

### Consent Flow
- [ ] Bank selection UI displays correctly
- [ ] Can select a bank
- [ ] Error shown when no bank selected
- [ ] Connect button initiates bank connection
- [ ] Skip button navigates to dashboard
- [ ] Deep link callback handled correctly

### Deep Linking
- [ ] App opens from custom URL (smartbachat://)
- [ ] App opens from HTTPS URL
- [ ] Query parameters parsed correctly
- [ ] Consent callback updates UI
- [ ] Error states handled properly

### Token Management
- [ ] Access token stored after login
- [ ] Refresh token stored after login
- [ ] Expired token triggers refresh
- [ ] Failed refresh logs user out
- [ ] Tokens cleared on logout

## E2E Testing (Future)

### Recommended Tools
- **Detox**: For React Native E2E testing
- **Appium**: Cross-platform mobile testing
- **Maestro**: Simple mobile UI testing

### E2E Test Scenarios
1. Complete registration flow
2. Login → Consent → Dashboard flow
3. Token refresh during session
4. Deep link handling from external app
5. Offline behavior
6. Error recovery

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what the user sees and does
   - Avoid testing internal state directly

2. **Keep Tests Independent**
   - Each test should run in isolation
   - Use `beforeEach` to reset state

3. **Use Descriptive Test Names**
   - `should login user with valid credentials`
   - Not: `test1` or `login test`

4. **Mock External Dependencies**
   - API calls
   - Navigation
   - Storage

5. **Test Error Cases**
   - Network failures
   - Invalid input
   - Edge cases

6. **Maintain Test Coverage**
   - Aim for >70% coverage
   - Focus on critical paths

## Debugging Tests

### Run Single Test in Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand api.test.ts
```

### View Test Output
```bash
npm test -- --verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)


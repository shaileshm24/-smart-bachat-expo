import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../components/LoginScreen';
import { RegisterScreen } from '../../components/RegisterScreen';
import { ConsentScreen } from '../../components/ConsentScreen';

// Mock the API
jest.mock('../../services/api', () => ({
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
  },
  bankApi: {
    initiateConnection: jest.fn(),
  },
  storage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

// Mock deep linking
jest.mock('../../services/deepLinking', () => ({
  registerDeepLinkHandler: jest.fn(),
  unregisterDeepLinkHandler: jest.fn(),
  openExternalUrl: jest.fn(),
}));

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginScreen', () => {
    test('should render login form', () => {
      const { getByPlaceholderText, getByText } = render(
        <LoginScreen
          onLoginSuccess={jest.fn()}
          onNavigateToRegister={jest.fn()}
        />
      );

      expect(getByPlaceholderText('Email or Mobile Number')).toBeTruthy();
      expect(getByPlaceholderText('Password')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
    });

    test('should show error for empty fields', async () => {
      const { getByText, findByText } = render(
        <LoginScreen
          onLoginSuccess={jest.fn()}
          onNavigateToRegister={jest.fn()}
        />
      );

      const loginButton = getByText('Login');
      fireEvent.press(loginButton);

      const errorMessage = await findByText('Please enter email/mobile and password');
      expect(errorMessage).toBeTruthy();
    });

    test('should call onLoginSuccess on successful login', async () => {
      const { authApi } = require('../../services/api');
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
      };

      authApi.login.mockResolvedValueOnce({
        status: 'SUCCESS',
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      });

      const onLoginSuccess = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <LoginScreen
          onLoginSuccess={onLoginSuccess}
          onNavigateToRegister={jest.fn()}
        />
      );

      const emailInput = getByPlaceholderText('Email or Mobile Number');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith({
          username: 'test@example.com',
          password: 'password123',
        });
        expect(onLoginSuccess).toHaveBeenCalledWith(mockUser);
      });
    });

    test('should navigate to register screen', () => {
      const onNavigateToRegister = jest.fn();
      const { getByText } = render(
        <LoginScreen
          onLoginSuccess={jest.fn()}
          onNavigateToRegister={onNavigateToRegister}
        />
      );

      const registerLink = getByText(/Create Account/i);
      fireEvent.press(registerLink);

      expect(onNavigateToRegister).toHaveBeenCalled();
    });
  });

  describe('RegisterScreen', () => {
    test('should render registration form', () => {
      const { getByPlaceholderText, getByText } = render(
        <RegisterScreen
          onRegisterSuccess={jest.fn()}
          onNavigateToLogin={jest.fn()}
        />
      );

      expect(getByPlaceholderText('First Name')).toBeTruthy();
      expect(getByPlaceholderText('Last Name')).toBeTruthy();
      expect(getByPlaceholderText('Email')).toBeTruthy();
      expect(getByPlaceholderText('Mobile Number')).toBeTruthy();
      expect(getByText('Create Account')).toBeTruthy();
    });

    test('should validate password confirmation', async () => {
      const { getByPlaceholderText, getByText, findByText } = render(
        <RegisterScreen
          onRegisterSuccess={jest.fn()}
          onNavigateToLogin={jest.fn()}
        />
      );

      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'different');
      fireEvent.press(getByText('Create Account'));

      const errorMessage = await findByText('Passwords do not match');
      expect(errorMessage).toBeTruthy();
    });

    test('should call onRegisterSuccess on successful registration', async () => {
      const { authApi } = require('../../services/api');
      const mockUser = {
        id: '1',
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
      };

      authApi.register.mockResolvedValueOnce({
        status: 'SUCCESS',
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      });

      const onRegisterSuccess = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <RegisterScreen
          onRegisterSuccess={onRegisterSuccess}
          onNavigateToLogin={jest.fn()}
        />
      );

      fireEvent.changeText(getByPlaceholderText('First Name'), 'New');
      fireEvent.changeText(getByPlaceholderText('Last Name'), 'User');
      fireEvent.changeText(getByPlaceholderText('Email'), 'newuser@example.com');
      fireEvent.changeText(getByPlaceholderText('Mobile Number'), '1234567890');
      fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
      fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'password123');
      fireEvent.press(getByText('Create Account'));

      await waitFor(() => {
        expect(authApi.register).toHaveBeenCalled();
        expect(onRegisterSuccess).toHaveBeenCalledWith(mockUser);
      });
    });
  });

  describe('ConsentScreen', () => {
    test('should render bank selection', () => {
      const { getByText } = render(
        <ConsentScreen
          onConsentComplete={jest.fn()}
          onSkip={jest.fn()}
        />
      );

      expect(getByText('Connect Your Bank')).toBeTruthy();
      expect(getByText('HDFC Bank')).toBeTruthy();
      expect(getByText('ICICI Bank')).toBeTruthy();
      expect(getByText('State Bank of India')).toBeTruthy();
    });

    test('should show error when no bank selected', async () => {
      const { getByText, findByText } = render(
        <ConsentScreen
          onConsentComplete={jest.fn()}
          onSkip={jest.fn()}
        />
      );

      fireEvent.press(getByText('Connect Bank'));

      const errorMessage = await findByText('Please select a bank');
      expect(errorMessage).toBeTruthy();
    });

    test('should call onSkip when skip button pressed', () => {
      const onSkip = jest.fn();
      const { getByText } = render(
        <ConsentScreen
          onConsentComplete={jest.fn()}
          onSkip={onSkip}
        />
      );

      fireEvent.press(getByText('Skip for Now'));
      expect(onSkip).toHaveBeenCalled();
    });
  });
});


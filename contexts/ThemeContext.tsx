import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme mode options
export type ThemeMode = 'light' | 'dark' | 'system';

// Color definitions for the app
export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  gold: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  border: string;
  borderLight: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  headerBackground: string;
  headerText: string;
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  cardBackground: string;
  cardBorder: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  placeholder: string;
  overlay: string;
  statusBar: 'light' | 'dark';
}

// Light theme colors
const lightColors: ThemeColors = {
  primary: '#2e7d32',
  primaryDark: '#1b5e20',
  primaryLight: '#4caf50',
  secondary: '#034a67',
  accent: '#f1c40f',
  gold: '#f1c40f',
  background: '#f8fafc',
  backgroundSecondary: '#f1f5f9',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  text: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  headerBackground: '#2e7d32',
  headerText: '#ffffff',
  tabBarBackground: '#ffffff',
  tabBarActive: '#2e7d32',
  tabBarInactive: '#94a3b8',
  cardBackground: '#ffffff',
  cardBorder: '#e2e8f0',
  inputBackground: '#ffffff',
  inputBorder: '#d1d5db',
  inputText: '#1e293b',
  placeholder: '#9ca3af',
  overlay: 'rgba(0, 0, 0, 0.5)',
  statusBar: 'light',
};

// Dark theme colors
const darkColors: ThemeColors = {
  primary: '#4caf50',
  primaryDark: '#2e7d32',
  primaryLight: '#81c784',
  secondary: '#5ba3c0',
  accent: '#ffd54f',
  gold: '#ffd54f',
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  surface: '#1e293b',
  surfaceElevated: '#334155',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textMuted: '#64748b',
  textInverse: '#0f172a',
  border: '#334155',
  borderLight: '#1e293b',
  success: '#4ade80',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
  headerBackground: '#1e293b',
  headerText: '#f1f5f9',
  tabBarBackground: '#1e293b',
  tabBarActive: '#4caf50',
  tabBarInactive: '#64748b',
  cardBackground: '#1e293b',
  cardBorder: '#334155',
  inputBackground: '#334155',
  inputBorder: '#475569',
  inputText: '#f1f5f9',
  placeholder: '#64748b',
  overlay: 'rgba(0, 0, 0, 0.7)',
  statusBar: 'dark',
};

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = '@smartbachat_theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      // Silent fail - use default
    } finally {
      setIsLoaded(true);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      // Silent fail
    }
  };

  const isDark = themeMode === 'system'
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  const colors = isDark ? darkColors : lightColors;

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { lightColors, darkColors };

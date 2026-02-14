import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {Dashboard} from "./components/Dashboard";
import {Expenses} from "./components/Expenses";
import {Goals} from "./components/Goals";
import {Coach} from "./components/Coach";
import {More} from "./components/More";
import {SplashScreen} from "./components/SplashScreen";
import {LoadingScreen} from "./components/LoadingScreen";
import {ErrorScreen} from "./components/ErrorScreen";
import {LoginScreen} from "./components/LoginScreen";
import {RegisterScreen} from "./components/RegisterScreen";
import {ConsentScreen} from "./components/ConsentScreen";
import {Logo} from "./components/Logo";
import CategoryTransactions from "./components/CategoryTransactions";

import {
  Home,
  Receipt,
  Target,
  MessageCircle,
  Menu,
  ArrowLeft,
} from "lucide-react-native";
import { getCategoryConfig } from "./utils/categoryIcons";
import { Provider } from "react-native-paper";
import { initializeDeepLinking } from "./services/deepLinking";

// Redux imports
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useAppSelector } from './store/hooks';
import { setReduxStore } from './services/api';

// Theme imports
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Connect Redux store to API service for token retrieval
setReduxStore(store);

type TabType = "dashboard" | "expenses" | "goals" | "coach" | "more";
type AppState = "splash" | "loading" | "login" | "register" | "consent" | "ready" | "error";

// Screen types for sub-navigation within tabs
type ScreenType = "tab" | "categoryDetails";

interface ScreenParams {
  category?: string;
}

// Main App Component wrapped with Redux
function AppContent() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("tab");
  const [screenParams, setScreenParams] = useState<ScreenParams>({});
  const [errorType, setErrorType] = useState<
    "network" | "server" | "general"
  >("general");

  // Get auth state from Redux
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Get theme colors
  const { colors, isDark } = useTheme();

  // Handle initial app load
  useEffect(() => {
    // Initialize deep linking
    initializeDeepLinking();

    const splashTimer = setTimeout(() => {
      setAppState("loading");
    }, 2000);

    const loadingTimer = setTimeout(() => {
      // Check if user is already logged in from persisted state
      if (isAuthenticated && user) {
        setAppState("ready");
      } else {
        setAppState("login");
      }
    }, 3500);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  // Handle auth state changes (e.g., token expiration, force logout)
  useEffect(() => {
    // Only redirect to login if we're in "ready" state and auth becomes invalid
    // This handles the case when JWT expires and refresh fails
    console.log("state", isAuthenticated, appState);
    
    if (appState === "ready" && !isAuthenticated) {
      setAppState("login");
    }
  }, [isAuthenticated, appState]);

  const handleRetry = () => {
    setAppState("loading");
    setTimeout(() => {
      setAppState("ready");
    }, 2000);
  };

  const handleGoHome = () => {
    setActiveTab("dashboard");
    setAppState("ready");
  };

  const handleLoginSuccess = (userData: any) => {
    // Redux already handles storing user data
    setAppState("consent");
  };

  const handleRegisterSuccess = (userData: any) => {
    // Redux already handles storing user data
    setAppState("consent");
  };

  const handleConsentComplete = () => {
    setAppState("ready");
  };

  const handleConsentSkip = () => {
    setAppState("ready");
  };

  // Navigation handlers for sub-screens
  const handleNavigateToCategoryDetails = (category: string) => {
    setCurrentScreen("categoryDetails");
    setScreenParams({ category });
  };

  const handleNavigateBack = () => {
    setCurrentScreen("tab");
    setScreenParams({});
  };

  const renderContent = () => {
    // If on a sub-screen, render that screen
    if (currentScreen === "categoryDetails" && screenParams.category) {
      return (
        <CategoryTransactions
          category={screenParams.category}
          onBack={handleNavigateBack}
        />
      );
    }

    // Otherwise render the active tab
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "expenses":
        return <Expenses onNavigateToCategoryDetails={handleNavigateToCategoryDetails} />;
      case "goals":
        return <Goals />;
      case "coach":
        return <Coach />;
      case "more":
        return <More />;
      default:
        return <Dashboard />;
    }
  };

  const tabs = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "goals", label: "Goals", icon: Target },
    { id: "coach", label: "Coach", icon: MessageCircle },
    { id: "more", label: "More", icon: Menu },
  ];

  return (
    <SafeAreaProvider>
      <Provider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          {appState === "splash" && <SplashScreen />}
          {appState === "loading" && (
            <LoadingScreen message="Setting up your account" />
          )}
          {appState === "login" && (
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => setAppState("register")}
            />
          )}
          {appState === "register" && (
            <RegisterScreen
              onRegisterSuccess={handleRegisterSuccess}
              onNavigateToLogin={() => setAppState("login")}
            />
          )}
          {appState === "consent" && (
            <ConsentScreen
              onConsentComplete={handleConsentComplete}
              onSkip={handleConsentSkip}
            />
          )}
          {appState === "error" && (
            <ErrorScreen
              type={errorType}
              onRetry={handleRetry}
              onGoHome={handleGoHome}
            />
          )}
          {appState === "ready" && (
            <>
              {/* Dynamic Header */}
              {currentScreen === "tab" ? (
                // App header for tab screens
                <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                  <View style={styles.headerLeft}>
                    <Logo size={44} variant={isDark ? 'dark' : 'default'} />
                    <View>
                      <Text style={[styles.appName, { color: colors.headerText }]}>Smart Bachat</Text>
                      <Text style={[styles.tagline, { color: isDark ? colors.textMuted : 'rgba(255,255,255,0.8)' }]}>
                        Your Trusted Savings Partner
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                // Category header for detail screens
                (() => {
                  const categoryConfig = screenParams.category
                    ? getCategoryConfig(screenParams.category)
                    : null;
                  const CategoryIcon = categoryConfig?.icon;

                  return (
                    <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
                      <TouchableOpacity onPress={handleNavigateBack} style={styles.backButton}>
                        <ArrowLeft size={24} color={colors.headerText} />
                      </TouchableOpacity>
                      {categoryConfig && CategoryIcon && (
                        <View style={[styles.categoryIconCircle, { backgroundColor: categoryConfig.bgColor }]}>
                          <CategoryIcon size={22} color={categoryConfig.color} />
                        </View>
                      )}
                      <View style={styles.headerContent}>
                        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
                          {screenParams.category}
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: isDark ? colors.textMuted : 'rgba(255,255,255,0.8)' }]}>
                          Category Transactions
                        </Text>
                      </View>
                    </View>
                  );
                })()
              )}

              {/* Content */}
              <View style={styles.mainContent}>{renderContent()}</View>

              {/* Bottom Tab Bar */}
              <View style={[styles.bottomNav, { backgroundColor: colors.tabBarBackground, borderColor: colors.border }]}>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setActiveTab(tab.id as TabType)}
                      style={styles.tabButton}
                    >
                      <Icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 1.6}
                        color={isActive ? colors.tabBarActive : colors.tabBarInactive}
                      />
                      <Text
                        style={[
                          styles.tabLabel,
                          { color: isActive ? colors.tabBarActive : colors.tabBarInactive },
                        ]}
                      >
                        {tab.label}
                      </Text>
                      {isActive && <View style={[styles.activeDot, { backgroundColor: colors.tabBarActive }]} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </SafeAreaView>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },

  header: {
    backgroundColor: "#2e7d32",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },

  backButton: {
    padding: 8,
    marginRight: 8,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },

  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  appName: { color: "white", fontSize: 18, fontWeight: "600" },

  tagline: { color: "rgba(255,255,255,0.8)", fontSize: 12 },

  headerRight: { alignItems: "flex-end" },

  smallText: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

  savingsText: { fontSize: 14, color: "white", fontWeight: "500" },

  mainContent: { flex: 1 },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },

  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  tabLabel: { fontSize: 11, marginTop: 3 },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2e7d32",
    marginTop: 3,
  },
});

// Export wrapped with Redux Provider and ThemeProvider
export default function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<LoadingScreen message="Loading..." />} persistor={persistor}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
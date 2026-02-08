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

import {
  Home,
  Receipt,
  Target,
  MessageCircle,
  Menu,
} from "lucide-react-native";
import { Provider } from "react-native-paper";
import { initializeDeepLinking } from "./services/deepLinking";

// Redux imports
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { useAppSelector } from './store/hooks';
import { setReduxStore } from './services/api';

// Connect Redux store to API service for token retrieval
setReduxStore(store);

type TabType = "dashboard" | "expenses" | "goals" | "coach" | "more";
type AppState = "splash" | "loading" | "login" | "register" | "consent" | "ready" | "error";

// Main App Component wrapped with Redux
function AppContent() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [errorType, setErrorType] = useState<
    "network" | "server" | "general"
  >("general");

  // Get auth state from Redux
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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
  }, [isAuthenticated, user]);

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

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "expenses":
        return <Expenses />;
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
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <StatusBar style="light" />
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
	              {/* Header */}
	              <View style={styles.header}>
	                <View style={styles.headerLeft}>
	                  <View style={styles.logoCircle}>
	                    <View style={styles.logoDot} />
	                  </View>
	                  <View>
	                    <Text style={styles.appName}>SmartBachat</Text>
	                    <Text style={styles.tagline}>
	                      Your Trusted Savings Partner
	                    </Text>
	                  </View>
	                </View>

	                <View style={styles.headerRight}>
	                  <Text style={styles.smallText}>Total Savings</Text>
	                  <Text style={styles.savingsText}>₹1,35,000</Text>
	                </View>
	              </View>

	              {/* Content */}
	              <View style={styles.mainContent}>{renderContent()}</View>

	              {/* Bottom Tab Bar */}
	              <View style={styles.bottomNav}>
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
	                        color={isActive ? "#2e7d32" : "#777"}
	                      />
	                      <Text
	                        style={[
	                          styles.tabLabel,
	                          { color: isActive ? "#2e7d32" : "#777" },
	                        ]}
	                      >
	                        {tab.label}
	                      </Text>
	                      {isActive && <View style={styles.activeDot} />}
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

  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  logoDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#f1c40f",
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

// Export wrapped with Redux Provider
export default function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<LoadingScreen message="Loading..." />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </ReduxProvider>
  );
}
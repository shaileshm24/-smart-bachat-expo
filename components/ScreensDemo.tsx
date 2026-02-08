import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SplashScreen } from "./SplashScreen";
import { LoadingScreen } from "./LoadingScreen";
import { ErrorScreen } from "./ErrorScreen";
import { SuccessScreen } from "./SuccessScreen";
import { EmptyState } from "./EmptyState";
import { OnboardingScreen } from "./OnboardingScreen";
import { Inbox, ArrowLeft } from "lucide-react-native";

type ScreenType =
  | "menu"
  | "splash"
  | "loading"
  | "onboarding"
  | "error-network"
  | "error-server"
  | "error-general"
  | "success"
  | "empty";

interface ScreensDemoProps {
  onBack?: () => void;
}

export function ScreensDemo({ onBack }: ScreensDemoProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("menu");

  if (currentScreen === "splash") return <SplashScreen />;

  if (currentScreen === "onboarding") return <OnboardingScreen onComplete={() => setCurrentScreen("menu")} />;

  if (currentScreen === "loading") {
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen message="Syncing your data..." />
        <TouchableOpacity
          style={styles.backButtonAbsolute}
          onPress={() => setCurrentScreen("menu")}
        >
          <ArrowLeft size={16} color="#034a67" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentScreen.startsWith("error")) {
    const typeMap: Record<string, "network" | "server" | "general"> = {
      "error-network": "network",
      "error-server": "server",
      "error-general": "general",
    };
    return (
      <ErrorScreen
        type={typeMap[currentScreen]}
        onRetry={() => setCurrentScreen("menu")}
        onGoHome={() => setCurrentScreen("menu")}
      />
    );
  }

  if (currentScreen === "success") {
    return (
      <SuccessScreen
        title="Goal Achieved! 🎉"
        message="Congratulations! You've successfully saved ₹50,000 for your vacation fund."
        actionLabel="View Goals"
        onAction={() => setCurrentScreen("menu")}
      />
    );
  }

  if (currentScreen === "empty") {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon={Inbox}
          title="No Transactions Yet"
          description="Start tracking your expenses by uploading bank statements or adding transactions manually."
          actionLabel="Add Transaction"
          onAction={() => setCurrentScreen("menu")}
        />
        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => setCurrentScreen("menu")}
        >
          <ArrowLeft size={16} color="#2e7d32" />
          <Text style={[styles.buttonText, { color: "#2e7d32" }]}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Menu
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.ghostButton}>
              <ArrowLeft size={20} color="#034a67" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Screen Previews</Text>
        </View>
        <Text style={styles.headerSubtitle}>Preview all the app screens and states</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Initial Screens</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={[styles.button, styles.outlineButton, { borderColor: "#2e7d32" }]} onPress={() => setCurrentScreen("splash")}>
            <Text style={[styles.buttonText, { color: "#2e7d32" }]}>Splash Screen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.outlineButton, { borderColor: "#f1c40f" }]} onPress={() => setCurrentScreen("onboarding")}>
            <Text style={[styles.buttonText, { color: "#f39c12" }]}>Onboarding</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton, { borderColor: "#034a67", width: "100%" }]}
            onPress={() => setCurrentScreen("loading")}
          >
            <Text style={[styles.buttonText, { color: "#034a67" }]}>Loading Screen</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Error Screens</Text>
        <View style={styles.buttonColumn}>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton, { borderColor: "#f87171" }]}
            onPress={() => setCurrentScreen("error-network")}
          >
            <Text style={[styles.buttonText, { color: "#b91c1c" }]}>Network Error</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton, { borderColor: "#f97316" }]}
            onPress={() => setCurrentScreen("error-server")}
          >
            <Text style={[styles.buttonText, { color: "#c2410c" }]}>Server Error</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton, { borderColor: "#facc15" }]}
            onPress={() => setCurrentScreen("error-general")}
          >
            <Text style={[styles.buttonText, { color: "#b45309" }]}>General Error</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>State Screens</Text>
        <View style={styles.buttonColumn}>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton, { borderColor: "#22c55e" }]}
            onPress={() => setCurrentScreen("success")}
          >
            <Text style={[styles.buttonText, { color: "#15803d" }]}>Success Screen</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton, { borderColor: "#d1d5db" }]}
            onPress={() => setCurrentScreen("empty")}
          >
            <Text style={[styles.buttonText, { color: "#374151" }]}>Empty State</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          Note: These screens are shown during app initialization, errors, and various states throughout the app.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  backButtonAbsolute: { position: "absolute", top: 16, left: 16, flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: "#fff", borderRadius: 6 },
  backButtonText: { marginLeft: 4, color: "#034a67" },
  header: { marginBottom: 24 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  headerTitle: { fontSize: 24, color: "#034a67", fontWeight: "bold", flex: 1 },
  headerSubtitle: { fontSize: 14, color: "#6b7280" },
  ghostButton: { padding: 4 },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, color: "#034a67", marginBottom: 8, fontWeight: "bold" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "space-between" },
  buttonColumn: { flexDirection: "column", gap: 8 },
  button: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 6, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  outlineButton: { borderWidth: 1, backgroundColor: "transparent" },
  buttonText: { fontSize: 14, fontWeight: "500" },
  note: { padding: 16, backgroundColor: "rgba(241,196,15,0.1)", borderRadius: 8, borderWidth: 1, borderColor: "rgba(241,196,15,0.3)" },
  noteText: { fontSize: 12, color: "#034a67" },
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AlertCircle, RefreshCw, Home, WifiOff, ServerCrash } from "lucide-react-native";

interface ErrorScreenProps {
  type?: "network" | "server" | "general";
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  fullScreen?: boolean;
}

export function ErrorScreen({
  type = "general",
  message,
  onRetry,
  onGoHome,
  fullScreen = true
}: ErrorScreenProps) {
  const errorConfig = {
    network: {
      icon: WifiOff,
      title: "No Internet Connection",
      description: message || "Please check your internet connection and try again.",
      color: "#034a67"
    },
    server: {
      icon: ServerCrash,
      title: "Server Error",
      description: message || "Something went wrong on our end. We're working to fix it.",
      color: "#e74c3c"
    },
    general: {
      icon: AlertCircle,
      title: "Oops! Something Went Wrong",
      description: message || "An unexpected error occurred. Please try again.",
      color: "#f39c12"
    }
  };

  const config = errorConfig[type];
  const Icon = config.icon;

  // --------------------- SMALL CARD VERSION ---------------------
  if (!fullScreen) {
    return (
      <View style={styles.card}>
        <View style={{ alignItems: "center" }}>
          <Icon size={48} color="#dc2626" style={{ marginBottom: 8 }} />
          <Text style={styles.cardTitle}>{config.title}</Text>
          <Text style={styles.cardDescription}>{config.description}</Text>

          {onRetry && (
            <TouchableOpacity style={styles.buttonPrimary} onPress={onRetry}>
              <RefreshCw size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.buttonPrimaryText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // --------------------- FULL SCREEN VERSION ---------------------
  return (
    <View style={styles.fullScreenContainer}>
      {/* Icon Background */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: `${config.color}20` }
        ]}
      >
        <Icon size={48} color={config.color} />
      </View>

      {/* Title + Description */}
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.description}>{config.description}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        {onRetry && (
          <TouchableOpacity style={styles.buttonPrimary} onPress={onRetry}>
            <RefreshCw size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.buttonPrimaryText}>Try Again</Text>
          </TouchableOpacity>
        )}

        {onGoHome && (
          <TouchableOpacity style={styles.buttonOutline} onPress={onGoHome}>
            <Home size={18} color="#034a67" style={{ marginRight: 6 }} />
            <Text style={styles.buttonOutlineText}>Go to Home</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Support Text */}
      <Text style={styles.supportText}>
        Still having trouble?{" "}
        <Text style={styles.supportLink}>Contact Support</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full Screen
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    elevation: 4
  },
  textWrapper: {
    alignItems: "center",
    marginBottom: 32,
    maxWidth: 300
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#034a67",
    marginBottom: 8,
    textAlign: "center"
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center"
  },

  // Buttons
  buttonGroup: {
    width: "100%",
    maxWidth: 260,
    marginBottom: 48
  },
  buttonPrimary: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600"
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#034a67",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonOutlineText: {
    color: "#034a67",
    fontSize: 15,
    fontWeight: "600"
  },

  // Support Text
  supportText: {
    marginTop: 24,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center"
  },
  supportLink: {
    color: "#2e7d32",
    textDecorationLine: "underline"
  },

  // Card Mode
  card: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    padding: 24,
    margin: 16,
    borderRadius: 12
  },
  cardTitle: {
    fontSize: 18,
    color: "#034a67",
    marginBottom: 8,
    fontWeight: "600"
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    textAlign: "center"
  }
});

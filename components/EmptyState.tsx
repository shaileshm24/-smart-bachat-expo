import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  fullScreen?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  fullScreen = false
}: EmptyStateProps) {
  const Content = (
    <View style={styles.contentContainer}>
      {/* Icon Box */}
      <View style={styles.iconWrapper}>
        <Icon size={40} color="#9ca3af" /> 
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Action Button */}
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (fullScreen) {
    return <View style={styles.fullScreenContainer}>{Content}</View>;
  }

  return <View style={styles.card}>{Content}</View>;
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    textAlign: "center"
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    color: "#034a67",
    marginBottom: 8,
    fontWeight: "600",
    textAlign: "center"
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    maxWidth: 300,
    textAlign: "center"
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    margin: 8
  }
});

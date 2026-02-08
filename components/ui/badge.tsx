import React from "react";
import { Text, View, StyleSheet, ViewStyle, TextStyle } from "react-native";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle | TextStyle;
}

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: {
      backgroundColor: "#2e7d32",
      borderColor: "transparent",
      borderWidth: 1,
    },
    text: {
      color: "#fff",
    },
  },
  secondary: {
    container: {
      backgroundColor: "#034a67",
      borderColor: "transparent",
      borderWidth: 1,
    },
    text: {
      color: "#fff",
    },
  },
  destructive: {
    container: {
      backgroundColor: "#dc2626",
      borderColor: "transparent",
      borderWidth: 1,
    },
    text: {
      color: "#fff",
    },
  },
  outline: {
    container: {
      backgroundColor: "transparent",
      borderColor: "#6b7280",
      borderWidth: 1,
    },
    text: {
      color: "#034a67",
    },
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  style,
}) => {
  const variantStyle = variantStyles[variant];

  return (
    <View style={[styles.container, variantStyle.container, style]}>
      <Text style={[styles.text, variantStyle.text]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
});

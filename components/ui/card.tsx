import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

interface CardProps extends ViewProps {}
interface CardTextProps extends TextProps {}
interface CardContentProps extends ViewProps {}
interface CardActionProps extends ViewProps {}

export const Card: React.FC<CardProps> = ({ style, children, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardProps> = ({ style, children, ...props }) => {
  return (
    <View style={[styles.cardHeader, style]} {...props}>
      {children}
    </View>
  );
};

export const CardTitle: React.FC<CardTextProps> = ({ style, children, ...props }) => {
  return (
    <Text style={[styles.cardTitle, style]} {...props}>
      {children}
    </Text>
  );
};

export const CardDescription: React.FC<CardTextProps> = ({ style, children, ...props }) => {
  return (
    <Text style={[styles.cardDescription, style]} {...props}>
      {children}
    </Text>
  );
};

export const CardAction: React.FC<CardActionProps> = ({ style, children, ...props }) => {
  return (
    <View style={[styles.cardAction, style]} {...props}>
      {children}
    </View>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ style, children, ...props }) => {
  return (
    <View style={[styles.cardContent, style]} {...props}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardContentProps> = ({ style, children, ...props }) => {
  return (
    <View style={[styles.cardFooter, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "column",
    gap: 12,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#034a67",
  },
  cardDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  cardAction: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

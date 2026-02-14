import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Loader2 } from "lucide-react-native";
import { Logo } from "./Logo";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export  function LoadingScreen({ message = "Loading...", fullScreen = true }: LoadingScreenProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin Animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse Animation
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      );

    createPulse(pulseAnim1, 0).start();
    createPulse(pulseAnim2, 200).start();
    createPulse(pulseAnim3, 400).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!fullScreen) {
    return (
      <View style={styles.centered}>
        <Loader2 size={32} color="#2e7d32" />
        <Text style={styles.smallText}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      {/* Logo */}
      <View style={{ marginBottom: 24 }}>
        <Logo size={80} variant="default" />
      </View>

      {/* Spinner */}
      <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />

      {/* Messages */}
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>Please wait...</Text>

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { backgroundColor: "#2e7d32", opacity: pulseAnim1 }]} />
        <Animated.View style={[styles.dot, { backgroundColor: "#034a67", opacity: pulseAnim2 }]} />
        <Animated.View style={[styles.dot, { backgroundColor: "#f1c40f", opacity: pulseAnim3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  centered: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  spinner: {
    width: 48,
    height: 48,
    borderWidth: 4,
    borderColor: "#e5e7eb",
    borderTopColor: "#2e7d32",
    borderRadius: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    color: "#034a67",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  smallText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
  },
});

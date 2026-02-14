import React from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Logo } from "./Logo";

export function SplashScreen() {
  // Spin animation for orbiting circle
  const spinAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Bounce animation for dots
  const bounceAnim = [0, 150, 300].map(delay =>
    React.useRef(new Animated.Value(0)).current
  );

  React.useEffect(() => {
    bounceAnim.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 150),
          Animated.timing(anim, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [bounceAnim]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Logo size={96} variant="splash" />
        <Animated.View style={[styles.orbitCircle, { transform: [{ rotate: spin }] }]} />
      </View>

      {/* App Name */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Smart Bachat</Text>
        <Text style={styles.subtitle}>Your Trusted Savings Partner</Text>
      </View>

      {/* Loading Dots */}
      <View style={styles.dotsContainer}>
        {bounceAnim.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { transform: [{ translateY: anim }] },
            ]}
          />
        ))}
      </View>

      {/* Tagline */}
      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>
          AI-Powered Smart Savings • Secure & Private
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logoContainer: {
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  orbitCircle: {
    position: "absolute",
    top: -8,
    left: -8,
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  textContainer: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 36, color: "#fff", fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  dotsContainer: { flexDirection: "row", marginTop: 32, gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f1c40f",
    marginHorizontal: 4,
  },
  taglineContainer: { position: "absolute", bottom: 48, alignItems: "center", paddingHorizontal: 24 },
  tagline: { fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center" },
});

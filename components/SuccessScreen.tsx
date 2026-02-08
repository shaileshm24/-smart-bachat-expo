import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from "react-native";
import { CheckCircle2, ArrowRight } from "lucide-react-native";

interface SuccessScreenProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  showConfetti?: boolean;
}

export function SuccessScreen({
  title,
  message,
  actionLabel = "Continue",
  onAction,
  showConfetti = true,
}: SuccessScreenProps) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Bounce animation for confetti emojis
  const confettiEmojis = [
    { emoji: "🎉", top: 40, left: 30, delay: 0 },
    { emoji: "✨", top: 80, right: 30, delay: 200 },
    { emoji: "🎊", bottom: 160, left: 60, delay: 400 },
    { emoji: "⭐", bottom: 200, right: 80, delay: 100 },
    { emoji: "🌟", top: 160, left: Dimensions.get("window").width / 4, delay: 300 },
    { emoji: "💫", bottom: 240, right: Dimensions.get("window").width / 4, delay: 500 },
  ];

  const bounceAnims = confettiEmojis.map(() => React.useRef(new Animated.Value(0)).current);

  React.useEffect(() => {
    bounceAnims.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(confettiEmojis[i].delay),
          Animated.timing(anim, { toValue: -10, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Confetti */}
      {showConfetti &&
        confettiEmojis.map((item, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.confetti,
              {
                ...item,
                transform: [{ translateY: bounceAnims[i] }],
              },
            ]}
          >
            {item.emoji}
          </Animated.Text>
        ))}

      {/* Success Icon */}
      <View style={styles.iconWrapper}>
        <Animated.View
          style={[
            styles.iconCircle,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <CheckCircle2 color="#fff" size={64} />
        </Animated.View>
        <View style={styles.ripple} />
      </View>

      {/* Success Message */}
      <View style={styles.messageWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      {/* Action Button */}
      {onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>
            {actionLabel} <ArrowRight color="#fff" size={16} />
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(46,125,50,0.1)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  confetti: {
    position: "absolute",
    fontSize: 24,
  },
  iconWrapper: {
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "linear-gradient(135deg, #2e7d32, #1b5e20)", // Use react-native-linear-gradient for real gradient
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  ripple: {
    position: "absolute",
    inset: 0,
    borderRadius: 48,
    backgroundColor: "rgba(46,125,50,0.3)",
  },
  messageWrapper: {
    alignItems: "center",
    marginBottom: 24,
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    color: "#034a67",
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

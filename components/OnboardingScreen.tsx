import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from "react-native";
import { ChevronRight, ChevronLeft, Sparkles, Target, TrendingUp, Shield } from "lucide-react-native";

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles size={64} color="#f1c40f" />,
      title: "Welcome to SmartBachat",
      description: "Your AI-powered savings partner that helps you save smarter, not harder.",
      colors: ["#2e7d32", "#1b5e20"]
    },
    {
      icon: <TrendingUp size={64} color="#2e7d32" />,
      title: "AI-Powered Insights",
      description: "Get personalized savings recommendations based on your spending patterns and financial goals.",
      colors: ["#034a67", "#023a52"]
    },
    {
      icon: <Target size={64} color="#034a67" />,
      title: "Track Your Goals",
      description: "Set savings goals and watch your progress with AI predictions that keep you on track.",
      colors: ["#f1c40f", "#f39c12"]
    },
    {
      icon: <Shield size={64} color="#fff" />,
      title: "Your Data is Safe",
      description: "All financial data is processed locally on your device. We never store your sensitive information.",
      colors: ["#2e7d32", "#034a67"]
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) onComplete();
    else setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Animation for icon
  const scaleAnim = new Animated.Value(0.8);

  Animated.timing(scaleAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();

  return (
    <View style={[styles.container, { backgroundColor: currentStepData.colors[0] }]}>
      {/* Skip Button */}
      {!isLastStep && (
        <View style={styles.skipContainer}>
          <TouchableOpacity onPress={onComplete}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          {currentStepData.icon}
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.description}>{currentStepData.description}</Text>
        </View>

        {/* Progress Dots */}
        <View style={styles.progressDots}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentStep
                  ? styles.activeDot
                  : index < currentStep
                  ? styles.pastDot
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={handleBack} style={[styles.navButton, styles.backButton]}>
            <ChevronLeft size={20} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleNext} style={[styles.navButton, styles.nextButton]}>
          <Text style={styles.nextButtonText}>{isLastStep ? "Get Started" : "Next"}</Text>
          {!isLastStep && <ChevronRight size={20} color="#034a67" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  skipContainer: { alignItems: "flex-end", marginBottom: 20 },
  skipText: { color: "#fff", fontSize: 16 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  textContainer: { alignItems: "center", maxWidth: 300, marginBottom: 32 },
  title: { fontSize: 28, color: "#fff", fontWeight: "bold", textAlign: "center", marginBottom: 12 },
  description: { fontSize: 16, color: "rgba(255,255,255,0.9)", textAlign: "center" },
  progressDots: { flexDirection: "row", gap: 8, marginBottom: 32 },
  dot: { height: 8, borderRadius: 4 },
  activeDot: { width: 32, backgroundColor: "#fff" },
  pastDot: { width: 8, backgroundColor: "rgba(255,255,255,0.7)" },
  inactiveDot: { width: 8, backgroundColor: "rgba(255,255,255,0.3)" },
  navigation: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  navButton: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  backButton: { backgroundColor: "rgba(255,255,255,0.3)" },
  backButtonText: { color: "#fff", marginLeft: 6 },
  nextButton: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", flexDirection: "row", marginLeft: 10 },
  nextButtonText: { color: "#034a67", fontWeight: "bold", marginRight: 6 },
});

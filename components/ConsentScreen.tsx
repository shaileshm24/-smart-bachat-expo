import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Building2, Shield, CheckCircle, ArrowRight, X } from "lucide-react-native";
import { bankApi } from "../services/api";
import { registerDeepLinkHandler, unregisterDeepLinkHandler, openExternalUrl, DeepLinkParams } from "../services/deepLinking";

interface ConsentScreenProps {
  onConsentComplete: () => void;
  onSkip: () => void;
}

export function ConsentScreen({ onConsentComplete, onSkip }: ConsentScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [consentId, setConsentId] = useState<string | null>(null);
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const benefits = [
    { icon: "🔒", title: "Secure & Encrypted", desc: "Bank-grade security" },
    { icon: "🤖", title: "Auto-categorization", desc: "AI-powered insights" },
    { icon: "📊", title: "Real-time Sync", desc: "Always up-to-date" },
    { icon: "💡", title: "Smart Suggestions", desc: "Personalized advice" },
  ];

  // Setup deep link handler for consent callback
  useEffect(() => {
    const handleConsentCallback = (params: DeepLinkParams) => {
      console.log('Consent callback received:', params);

      if (params.status === 'success' || params.status === 'ACTIVE') {
        Alert.alert(
          'Success! 🎉',
          'Your bank account has been connected successfully.',
          [{ text: 'Continue', onPress: onConsentComplete }]
        );
      } else if (params.status === 'failed' || params.error) {
        setError(params.error || 'Consent failed. Please try again.');
        setLoading(false);
      } else if (params.status === 'cancelled') {
        setError('Consent was cancelled.');
        setLoading(false);
      }
    };

    // Register handler for consent callback
    registerDeepLinkHandler('consent', handleConsentCallback);

    // Cleanup
    return () => {
      unregisterDeepLinkHandler('consent');
    };
  }, [onConsentComplete]);

  const handleConnectBank = async () => {
    // Validate mobile number
    if (!mobileNumber || mobileNumber.trim().length === 0) {
      setError("Please enter your mobile number");
      return;
    }

    // Basic validation - should be 10 digits
    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log('🏦 Initiating bank connection with mobile:', cleanNumber);

      const response = await bankApi.initiateConnection({
        mobileNumber: cleanNumber,
      });

      console.log('✅ Bank connection response:', response);

      // Store consent ID for tracking
      if (response.consentId) {
        setConsentId(response.consentId);
      }

      // Open the Account Aggregator consent URL
      if (response.redirectUrl) {
        try {
          await openExternalUrl(response.redirectUrl);

          // Show helpful message for Expo Go users
          setTimeout(() => {
            Alert.alert(
              '📱 Approve Consent',
              'After approving consent in your browser:\n\n' +
              '1. Switch back to this app\n' +
              '2. Tap "Check Connection Status" button\n\n' +
              'Note: Automatic redirect may not work in Expo Go.',
              [{ text: 'Got it!' }]
            );
            setLoading(false); // Stop loading so user can tap the check button
            setShowCheckButton(true); // Show the check status button
          }, 1000);

        } catch (urlError) {
          console.error('Failed to open consent URL:', urlError);
          setError('Failed to open consent page. Please try again.');
          setLoading(false);
        }
      } else {
        // No redirect URL - show error
        setError(response.message || "Failed to connect bank");
        setLoading(false);
      }
    } catch (err: any) {
      console.error('❌ Bank connection error:', err);
      setError(err.message || "Failed to connect bank. Please try again.");
      setLoading(false);
    }
  };

  const handleCheckStatus = () => {
    // For now, just show success since we don't have a backend endpoint yet
    // In production, you would call: await bankApi.checkConsentStatus(consentId)

    Alert.alert(
      'Success! 🎉',
      'Your bank account has been connected successfully.\n\n' +
      'You can now track your transactions automatically!',
      [
        {
          text: 'Continue',
          onPress: () => {
            setShowCheckButton(false);
            onConsentComplete();
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <X size={24} color="#666" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Text style={styles.headerIcon}>🔗</Text>
          </View>
          <Text style={styles.title}>Connect Your Bank</Text>
          <Text style={styles.subtitle}>
            Link your bank account for automatic transaction tracking 🎯
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.sectionTitle}>Why Connect?</Text>
          <View style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mobile Number Input */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Enter Mobile Number</Text>
          <Text style={styles.inputHint}>
            Enter the mobile number registered with your bank account
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!loading}
            />
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Shield size={20} color="#2e7d32" />
          <Text style={styles.securityText}>
            We use Account Aggregator framework approved by RBI. Your credentials
            are never stored. 🔐
          </Text>
        </View>

        {/* Connect Button */}
        {!showCheckButton ? (
          <TouchableOpacity
            style={[
              styles.connectButton,
              (!mobileNumber || loading) && styles.connectButtonDisabled,
            ]}
            onPress={handleConnectBank}
            disabled={!mobileNumber || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.connectButtonText}>Connect Bank Account</Text>
                <ArrowRight size={20} color="white" />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <>
            {/* Info message */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>✅ Consent Page Opened</Text>
              <Text style={styles.infoText}>
                After approving consent in your browser, return here and tap the button below.
              </Text>
            </View>

            {/* Check Status Button */}
            <TouchableOpacity
              style={[styles.checkButton, checkingStatus && styles.checkButtonDisabled]}
              onPress={handleCheckStatus}
              disabled={checkingStatus}
            >
              {checkingStatus ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <CheckCircle size={20} color="white" />
                  <Text style={styles.checkButtonText}>Check Connection Status</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipTextButton} onPress={onSkip}>
          <Text style={styles.skipText}>I'll do this later</Text>
        </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  header: { alignItems: "center", marginTop: 20, marginBottom: 30 },
  skipButton: { position: "absolute", right: 0, top: 0, padding: 8 },
  iconContainer: { marginBottom: 16 },
  headerIcon: { fontSize: 60 },
  title: { fontSize: 26, fontWeight: "bold", color: "#2e7d32", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", paddingHorizontal: 20 },
  benefitsContainer: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 16 },
  benefitsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  benefitCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  benefitIcon: { fontSize: 32, marginBottom: 8 },
  benefitTitle: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  benefitDesc: { fontSize: 12, color: "#666", textAlign: "center" },
  inputSection: { marginBottom: 20 },
  inputHint: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: { color: "#c62828", fontSize: 14 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 16,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  securityText: { flex: 1, fontSize: 13, color: "#2e7d32", lineHeight: 18 },
  connectButton: {
    backgroundColor: "#2e7d32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  connectButtonDisabled: { opacity: 0.5 },
  connectButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1565c0",
    lineHeight: 20,
  },
  checkButton: {
    backgroundColor: "#1976d2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  checkButtonDisabled: { opacity: 0.5 },
  checkButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  skipTextButton: { alignItems: "center", marginTop: 16 },
  skipText: { color: "#666", fontSize: 14, textDecorationLine: "underline" },
});


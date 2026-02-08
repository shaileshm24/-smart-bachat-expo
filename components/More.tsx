import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch as RNSwitch,
  StyleSheet,
} from "react-native";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScreensDemo } from "./ScreensDemo";
import {
  BarChart3,
  Shield,
  Bell,
  FileText,
  Award,
  Settings,
  ChevronRight,
  Trophy,
  Flame,
  Code,
} from "lucide-react-native";

export function More() {
  const [showScreensDemo, setShowScreensDemo] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  if (showScreensDemo) {
    return <ScreensDemo onBack={() => setShowScreensDemo(false)} />;
  }

  const badges = [
    { name: "Early Bird", icon: "🌅", earned: true },
    { name: "Budget Master", icon: "📊", earned: true },
    { name: "Goal Crusher", icon: "🎯", earned: true },
    { name: "Smart Spender", icon: "💰", earned: true },
    { name: "Streak Master", icon: "🔥", earned: true },
    { name: "Financial Guru", icon: "🧠", earned: false },
    { name: "Diamond Saver", icon: "💎", earned: false },
    { name: "Investment Pro", icon: "📈", earned: false },
  ];

  const profiles = [
    { name: "Personal", icon: "👤", balance: "₹45,280", active: true, color: "#2e7d32" },
    { name: "Joint Account", icon: "👥", balance: "₹1,28,500", active: false, color: "#034a67" },
    { name: "Business", icon: "💼", balance: "₹3,42,150", active: false, color: "#f1c40f" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>Rahul Sharma</Text>
              <Text style={styles.profileEmail}>rahul.sharma@email.com</Text>
              <View style={styles.profileBadges}>
                <Badge style={{ backgroundColor: "#f1c40f", color: "#034a67", marginRight: 4 }}>
                  <Trophy size={12} /> Level 8
                </Badge>
                <Badge style={{ backgroundColor: "#2e7d32", color: "#fff" }}>
                  <Flame size={12} /> 12 Day Streak
                </Badge>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Profiles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manage Profiles</Text>
        {profiles.map((profile, idx) => (
          <Card
            key={idx}
            style={[
              styles.card,
              profile.active
                ? { borderColor: "#2e7d32", backgroundColor: "rgba(46,125,50,0.05)" }
                : {},
            ]}
          >
            <View style={styles.profileRow}>
              <View style={styles.profileIcon}>
                <Text style={{ fontSize: 20 }}>{profile.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  {profile.active && (
                    <Badge
                      style={{
                        backgroundColor: "#2e7d32",
                        color: "#fff",
                        fontSize: 10,
                        marginLeft: 4,
                      }}
                    >
                      Active
                    </Badge>
                  )}
                </View>
                <Text style={styles.profileBalance}>{profile.balance}</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </View>
          </Card>
        ))}
        <TouchableOpacity style={styles.addProfileButton}>
          <Text style={styles.addProfileText}>+ Add New Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Award size={16} color="#f1c40f" /> Achievements & Badges
        </Text>
        <Card style={styles.card}>
          <View style={styles.badgesGrid}>
            {badges.map((badge, idx) => (
              <View key={idx} style={styles.badgeItem}>
                <View
                  style={[
                    styles.badgeIcon,
                    badge.earned
                      ? { backgroundColor: "#f1c40f" }
                      : { backgroundColor: "#e5e7eb", opacity: 0.4 },
                  ]}
                >
                  <Text>{badge.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.badgeText,
                    badge.earned ? { color: "#034a67" } : { color: "#9ca3af" },
                  ]}
                >
                  {badge.name.split(" ")[0]}
                </Text>
              </View>
            ))}
          </View>
          <Separator style={{ marginVertical: 8 }} />
          <View style={{ alignItems: "center" }}>
            <Text style={styles.badgeSummary}>
              <Text style={{ color: "#2e7d32", fontWeight: "bold" }}>5 of 8</Text> badges earned
            </Text>
            <TouchableOpacity>
              <Text style={styles.viewAllAchievements}>View All Achievements</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      {/* Insights & Reports */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights & Reports</Text>
        <Card style={styles.cardRow}>
          <View style={styles.iconCircle}>
            <BarChart3 size={20} color="#2e7d32" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardRowTitle}>Monthly Report</Text>
            <Text style={styles.cardRowSubtitle}>Detailed spending analysis</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </Card>

        <Card style={styles.cardRow}>
          <View style={styles.iconCircle}>
            <FileText size={20} color="#034a67" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardRowTitle}>Export Statements</Text>
            <Text style={styles.cardRowSubtitle}>Download PDF reports</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </Card>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Card style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12 }}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#034a67" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Get alerts & reminders</Text>
              </View>
            </View>
            <RNSwitch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#ccc", true: "#2e7d32" }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Shield size={20} color="#034a67" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.settingTitle}>Data Privacy</Text>
                <Text style={styles.settingSubtitle}>Offline processing enabled</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Settings size={20} color="#034a67" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.settingTitle}>App Settings</Text>
                <Text style={styles.settingSubtitle}>Customize your experience</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => setShowScreensDemo(true)}>
            <View style={styles.settingInfo}>
              <Code size={20} color="#f1c40f" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.settingTitle}>View Screen Previews</Text>
                <Text style={styles.settingSubtitle}>Test loading, error & success screens</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Privacy Info */}
      <View style={styles.section}>
        <Card style={[styles.cardRow, { backgroundColor: "rgba(46,125,50,0.05)", borderColor: "rgba(46,125,50,0.3)" }]}>
          <Shield size={20} color="#2e7d32" />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text style={{ color: "#034a67", fontSize: 14, marginBottom: 2 }}>Your Data is Safe</Text>
            <Text style={{ color: "#6b7280", fontSize: 12 }}>
              All your financial data is processed locally on your device. We never store your bank statements or transaction details on our servers.
            </Text>
          </View>
        </Card>
      </View>

      {/* App Info */}
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 10, color: "#6b7280" }}>SmartBachat v1.0.0</Text>
        <Text style={{ fontSize: 10, color: "#6b7280" }}>Made with ❤️ for better savings</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
          <TouchableOpacity>
            <Text style={{ color: "#2e7d32", textDecorationLine: "underline", fontSize: 10 }}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 4, fontSize: 10 }}>•</Text>
          <TouchableOpacity>
            <Text style={{ color: "#2e7d32", textDecorationLine: "underline", fontSize: 10 }}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  section: { paddingHorizontal: 16, paddingBottom: 16 },
  card: { padding: 12, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12 },
  profileRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2e7d32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileName: { fontSize: 16, color: "#034a67" },
  profileEmail: { fontSize: 12, color: "#6b7280" },
  profileBadges: { flexDirection: "row", marginTop: 4 },
  editProfileButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center",
  },
  editProfileText: { color: "#2e7d32" },
  sectionTitle: { fontSize: 14, color: "#034a67", marginBottom: 8 },
  profileIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#e5e7eb", justifyContent: "center", alignItems: "center", marginRight: 8 },
  profileBalance: { fontSize: 12, color: "#6b7280" },
  addProfileButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2e7d32",
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: "center",
    borderStyle: "dashed",
  },
  addProfileText: { color: "#2e7d32" },
  badgesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  badgeItem: { alignItems: "center", width: "22%", marginBottom: 8 },
  badgeIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: "center", alignItems: "center", marginBottom: 4 },
  badgeText: { fontSize: 10, textAlign: "center" },
  badgeSummary: { fontSize: 12, color: "#6b7280" },
  viewAllAchievements: { color: "#2e7d32", fontSize: 12, marginTop: 2 },
  cardRow: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, marginBottom: 8 },
  cardRowTitle: { fontSize: 14, color: "#034a67" },
  cardRowSubtitle: { fontSize: 10, color: "#6b7280" },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 8, backgroundColor: "rgba(46,125,50,0.1)" },
  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 },
  settingInfo: { flexDirection: "row", alignItems: "center" },
  settingTitle: { fontSize: 14, color: "#034a67" },
  settingSubtitle: { fontSize: 10, color: "#6b7280" },
});

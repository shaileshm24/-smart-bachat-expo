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
  Sun,
  Moon,
  Smartphone,
} from "lucide-react-native";
import { useTheme, ThemeMode } from "../contexts/ThemeContext";

export function More() {
  const [showScreensDemo, setShowScreensDemo] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const { colors, isDark, themeMode, setThemeMode } = useTheme();

  if (showScreensDemo) {
    return <ScreensDemo onBack={() => setShowScreensDemo(false)} />;
  }

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Smartphone },
  ];

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Card style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.profileRow}>
            <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
              <Text style={{ fontSize: 24 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.profileName, { color: colors.text }]}>Rahul Sharma</Text>
              <Text style={[styles.profileEmail, { color: colors.textMuted }]}>rahul.sharma@email.com</Text>
              <View style={styles.profileBadges}>
                <Badge style={{ backgroundColor: colors.gold, color: colors.secondary, marginRight: 4 }}>
                  <Trophy size={12} /> Level 8
                </Badge>
                <Badge style={{ backgroundColor: colors.primary, color: colors.textInverse }}>
                  <Flame size={12} /> 12 Day Streak
                </Badge>
              </View>
            </View>
          </View>
          <TouchableOpacity style={[styles.editProfileButton, { borderColor: colors.primary }]}>
            <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Profiles */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Manage Profiles</Text>
        {profiles.map((profile, idx) => (
          <Card
            key={idx}
            style={[
              styles.card,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
              profile.active
                ? { borderColor: colors.primary, backgroundColor: isDark ? 'rgba(76,175,80,0.1)' : 'rgba(46,125,50,0.05)' }
                : {},
            ]}
          >
            <View style={styles.profileRow}>
              <View style={[styles.profileIcon, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={{ fontSize: 20 }}>{profile.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
                  {profile.active && (
                    <Badge
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.textInverse,
                        fontSize: 10,
                        marginLeft: 4,
                      }}
                    >
                      Active
                    </Badge>
                  )}
                </View>
                <Text style={[styles.profileBalance, { color: colors.textMuted }]}>{profile.balance}</Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </View>
          </Card>
        ))}
        <TouchableOpacity style={[styles.addProfileButton, { borderColor: colors.primary }]}>
          <Text style={[styles.addProfileText, { color: colors.primary }]}>+ Add New Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
          <Award size={16} color={colors.gold} /> Achievements & Badges
        </Text>
        <Card style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.badgesGrid}>
            {badges.map((badge, idx) => (
              <View key={idx} style={styles.badgeItem}>
                <View
                  style={[
                    styles.badgeIcon,
                    badge.earned
                      ? { backgroundColor: colors.gold }
                      : { backgroundColor: colors.backgroundSecondary, opacity: 0.4 },
                  ]}
                >
                  <Text>{badge.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.badgeText,
                    badge.earned ? { color: colors.secondary } : { color: colors.textMuted },
                  ]}
                >
                  {badge.name.split(" ")[0]}
                </Text>
              </View>
            ))}
          </View>
          <Separator style={{ marginVertical: 8, backgroundColor: colors.border }} />
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.badgeSummary, { color: colors.textMuted }]}>
              <Text style={{ color: colors.primary, fontWeight: "bold" }}>5 of 8</Text> badges earned
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllAchievements, { color: colors.primary }]}>View All Achievements</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      {/* Insights & Reports */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Insights & Reports</Text>
        <Card style={[styles.cardRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(76,175,80,0.15)' : 'rgba(46,125,50,0.1)' }]}>
            <BarChart3 size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardRowTitle, { color: colors.text }]}>Monthly Report</Text>
            <Text style={[styles.cardRowSubtitle, { color: colors.textMuted }]}>Detailed spending analysis</Text>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </Card>

        <Card style={[styles.cardRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(91,163,192,0.15)' : 'rgba(3,74,103,0.1)' }]}>
            <FileText size={20} color={colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardRowTitle, { color: colors.text }]}>Export Statements</Text>
            <Text style={[styles.cardRowSubtitle, { color: colors.textMuted }]}>Download PDF reports</Text>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </Card>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Settings</Text>
        <Card style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.cardBackground }}>
          {/* Theme Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              {isDark ? <Moon size={20} color={colors.primary} /> : <Sun size={20} color={colors.primary} />}
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Appearance</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                  {themeMode === 'system' ? 'Following system' : themeMode === 'dark' ? 'Dark mode' : 'Light mode'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.themeToggleContainer}>
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = themeMode === option.mode;
              return (
                <TouchableOpacity
                  key={option.mode}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setThemeMode(option.mode)}
                >
                  <Icon size={16} color={isSelected ? colors.textInverse : colors.textSecondary} />
                  <Text style={[
                    styles.themeOptionText,
                    { color: isSelected ? colors.textInverse : colors.textSecondary }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Separator style={{ backgroundColor: colors.border }} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.secondary} />
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>Get alerts & reminders</Text>
              </View>
            </View>
            <RNSwitch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Shield size={20} color={colors.secondary} />
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Data Privacy</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>Offline processing enabled</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Settings size={20} color={colors.secondary} />
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>App Settings</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>Customize your experience</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => setShowScreensDemo(true)}>
            <View style={styles.settingInfo}>
              <Code size={20} color={colors.gold} />
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>View Screen Previews</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>Test loading, error & success screens</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>
      </View>

      {/* Privacy Info */}
      <View style={styles.section}>
        <Card style={[styles.cardRow, { backgroundColor: isDark ? 'rgba(76,175,80,0.1)' : 'rgba(46,125,50,0.05)', borderColor: isDark ? 'rgba(76,175,80,0.3)' : 'rgba(46,125,50,0.3)' }]}>
          <Shield size={20} color={colors.primary} />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 14, marginBottom: 2 }}>Your Data is Safe</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              All your financial data is processed locally on your device. We never store your bank statements or transaction details on our servers.
            </Text>
          </View>
        </Card>
      </View>

      {/* App Info */}
      <View style={{ padding: 16, alignItems: "center" }}>
        <Text style={{ fontSize: 10, color: colors.textMuted }}>SmartBachat v1.0.0</Text>
        <Text style={{ fontSize: 10, color: colors.textMuted }}>Made with ❤️ for better savings</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, textDecorationLine: "underline", fontSize: 10 }}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 4, fontSize: 10, color: colors.textMuted }}>•</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, textDecorationLine: "underline", fontSize: 10 }}>Terms of Service</Text>
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
  themeToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { Zap, Wallet, Target, TrendingUp, TrendingDown, Filter } from "lucide-react-native";
import { aiApi, DashboardResponse, DashboardTransaction, bankApi } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";

// Temporary Icon component to replace react-native-vector-icons
const Icon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  const iconMap: any = {
    zap: Zap,
    wallet: Wallet,
    target: Target,
    "trending-up": TrendingUp,
    "trending-down": TrendingDown,
  };
  const IconComponent = iconMap[name] || Wallet;
  return <IconComponent size={size} color={color} />;
};

// Helper function to get category icon
const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    'FOOD': '🍔',
    'SHOPPING': '🛒',
    'TRANSPORT': '🚗',
    'UTILITIES': '💡',
    'INVESTMENT': '💰',
    'ENTERTAINMENT': '🎬',
    'HEALTHCARE': '🏥',
    'EDUCATION': '📚',
    'OTHER': '💳',
  };
  return iconMap[category] || '💳';
};

// Helper function to format date
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

// Cache dashboard data to prevent refetching on tab switches
let cachedDashboardData: DashboardResponse | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(cachedDashboardData);
  const [loading, setLoading] = useState(!cachedDashboardData);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, isDark } = useTheme();
  const hasFetched = useRef(false);

  // Transaction filtering state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const isCacheValid = cachedDashboardData && (now - lastFetchTime) < CACHE_DURATION;

    // Only fetch if we don't have cached data or cache is expired
    if (!isCacheValid && !hasFetched.current) {
      hasFetched.current = true;
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (!cachedDashboardData) {
        setLoading(true);
      }
      setError(null);
      const data = await bankApi.getDashboard();

      console.log("Dashboard data", data);
      
      // Update cache
      cachedDashboardData = data;
      lastFetchTime = Date.now();

      setDashboardData(data);
	    } catch (err: any) {
	      // Don't show error if session expired - app will redirect to login
	      if (err?.sessionExpired) {
	        // Session expiration is handled globally via Redux/App state changes
	        return;
	      }
	      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    // Force refresh - reset the fetch flag and fetch new data
    hasFetched.current = false;
    fetchDashboardData(true);
  };

  // Filter transactions by category
  const getFilteredTransactions = (): DashboardTransaction[] => {
    if (!dashboardData?.recentTransactions) return [];

    if (!selectedCategory) {
      return dashboardData.recentTransactions;
    }

    return dashboardData.recentTransactions.filter(
      tx => tx.category === selectedCategory
    );
  };

  // Get unique categories from transactions
  const getCategories = (): string[] => {
    if (!dashboardData?.recentTransactions) return [];

    const categories = new Set(
      dashboardData.recentTransactions.map(tx => tx.category)
    );
    return Array.from(categories).sort();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error || !dashboardData) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {error || 'Failed to load dashboard'}</Text>
        <TouchableOpacity onPress={() => fetchDashboardData()}>
          <Text style={[styles.retryText, { color: colors.primary }]}>Tap to retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const savingsProgress = dashboardData.savingsGoal.totalTarget > 0
    ? dashboardData.savingsGoal.progressPercent
    : 0;

  const filteredTransactions = getFilteredTransactions();
  const categories = getCategories();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.secondary]}
          tintColor={colors.secondary}
        />
      }
    >

      {/* AI Smart Nudge */}
      <View style={[styles.nudgeBox, { backgroundColor: isDark ? 'rgba(255,213,79,0.15)' : '#fffbe6', borderColor: isDark ? 'rgba(255,213,79,0.3)' : '#ffe58f' }]}>
        <Icon name="zap" size={20} color={colors.gold} />
        <Text style={[styles.nudgeText, { color: colors.text }]}>
          <Text style={{ fontWeight: "bold" }}>{dashboardData.nudge.title}</Text> {dashboardData.nudge.message}
        </Text>
      </View>

      {/* Balance Card */}
      <View style={[styles.balanceCard, { backgroundColor: '#034a67' }]}>
        <View>
          <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>Current Balance</Text>
          <Text style={[styles.balance, { color: '#fff' }]}>₹{dashboardData.balance.totalBalance.toLocaleString("en-IN")}</Text>
          <Text style={[styles.subLabel, { color: 'rgba(255,255,255,0.7)' }]}>{dashboardData.balance.accountCount} accounts • Last synced: {new Date(dashboardData.balance.lastSyncedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <Icon name="wallet" size={36} color="#ffffffaa" />
      </View>

      {/* Savings Goal */}
      <View style={[styles.goalCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={styles.goalHeader}>
          <Icon name="target" size={20} color={colors.primary} />
          <Text style={[styles.goalTitle, { color: colors.text }]}>Monthly Savings Goal</Text>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { color: colors.textInverse }]}>{Math.round(savingsProgress)}%</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBackground, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${savingsProgress}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>

        <View style={styles.goalFooter}>
          <Text style={[styles.grayText, { color: colors.textMuted }]}>₹{dashboardData.savingsGoal.totalSaved.toLocaleString("en-IN")} saved</Text>
          <Text style={[styles.greenText, { color: colors.primary }]}>₹{dashboardData.savingsGoal.totalTarget.toLocaleString("en-IN")} goal</Text>
        </View>
      </View>

      {/* Gamification Boxes */}
      <View style={styles.gamificationRow}>
        <View style={[styles.gamificationCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={styles.emoji}>🔥</Text>
          <Text style={[styles.gamificationValue, { color: colors.text }]}>{dashboardData.gamification.currentStreak}</Text>
          <Text style={[styles.gamificationLabel, { color: colors.textMuted }]}>Day Streak</Text>
        </View>

        <View style={[styles.gamificationCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={styles.emoji}>🏆</Text>
          <Text style={[styles.gamificationValue, { color: colors.text }]}>{dashboardData.gamification.totalBadges}</Text>
          <Text style={[styles.gamificationLabel, { color: colors.textMuted }]}>Badges</Text>
        </View>

        <View style={[styles.gamificationCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={styles.emoji}>⭐</Text>
          <Text style={[styles.gamificationValue, { color: colors.text }]}>{dashboardData.gamification.activeChallenges.length}</Text>
          <Text style={[styles.gamificationLabel, { color: colors.textMuted }]}>Challenges</Text>
        </View>
      </View>

      {/* Forecast */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>This Month's Forecast</Text>
      <View style={[styles.forecastCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>

        <View style={styles.forecastRow}>
          <View style={styles.rowLeft}>
            <Icon name="trending-up" size={18} color={colors.success} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Expected Income</Text>
          </View>
          <Text style={[styles.greenText, { color: colors.success }]}>+₹{dashboardData.forecast.projected_income.toLocaleString("en-IN")}</Text>
        </View>

        <View style={styles.forecastRow}>
          <View style={styles.rowLeft}>
            <Icon name="trending-down" size={18} color={colors.error} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Predicted Expenses</Text>
          </View>
          <Text style={[styles.redText, { color: colors.error }]}>-₹{dashboardData.forecast.projected_expense.toLocaleString("en-IN")}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.forecastRow}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Net Savings</Text>
          <Text style={{ color: dashboardData.forecast.projected_savings >= 0 ? colors.success : colors.error, fontWeight: '600' }}>
            {dashboardData.forecast.projected_savings >= 0 ? '+' : ''}₹{dashboardData.forecast.projected_savings.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Forecast Insights */}
        {dashboardData.forecast.insights.length > 0 && (
          <View style={{ marginTop: 12 }}>
            {dashboardData.forecast.insights.map((insight, index) => (
              <Text key={index} style={[styles.insightText, { color: colors.textSecondary }]}>• {insight}</Text>
            ))}
          </View>
        )}

      </View>

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Alerts & Reminders</Text>
          {dashboardData.alerts.map((alert: any, index: number) => (
            <View key={index} style={[styles.alertCardOrange, { backgroundColor: isDark ? 'rgba(211,84,0,0.15)' : '#fff3e0', borderColor: isDark ? 'rgba(211,84,0,0.3)' : '#ffcc80' }]}>
              <Icon name="alert-circle" size={18} color={colors.warning} />
              <Text style={[styles.alertText, { color: colors.text }]}>{alert.message}</Text>
            </View>
          ))}
        </>
      )}

      {/* Recent Transactions */}
      <View style={styles.transactionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: isDark ? 'rgba(91,163,192,0.15)' : 'rgba(3,74,103,0.1)' }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} color={colors.secondary} />
          <Text style={[styles.filterButtonText, { color: colors.secondary }]}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      {showFilters && categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
              !selectedCategory && { backgroundColor: colors.secondary, borderColor: colors.secondary }
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.filterChipText,
              { color: colors.text },
              !selectedCategory && { color: colors.textInverse }
            ]}>
              All
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
                selectedCategory === category && { backgroundColor: colors.secondary, borderColor: colors.secondary }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.filterChipIcon}>{getCategoryIcon(category)}</Text>
              <Text style={[
                styles.filterChipText,
                { color: colors.text },
                selectedCategory === category && { color: colors.textInverse }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Transactions List */}
      <View style={[styles.transactionsCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📭</Text>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Transactions Found</Text>
            <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
              {selectedCategory
                ? `No transactions in ${selectedCategory} category`
                : 'Connect your bank account to see transactions'}
            </Text>
            {selectedCategory && (
              <TouchableOpacity
                style={[styles.clearFilterButton, { backgroundColor: colors.secondary }]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[styles.clearFilterText, { color: colors.textInverse }]}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.transactionRow, { borderBottomColor: colors.border }]}>
                <View style={[styles.txIcon, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={{ fontSize: 18 }}>{getCategoryIcon(item.category)}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.txName, { color: colors.text }]}>{item.merchant || item.description.substring(0, 30)}</Text>
                  <Text style={[styles.txMeta, { color: colors.textMuted }]}>
                    {item.category} • {formatDate(item.txnDate)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    { color: item.direction === 'CREDIT' ? colors.success : colors.secondary },
                  ]}
                >
                  {item.direction === 'CREDIT' ? "+" : "-"}₹{item.amount.toLocaleString("en-IN")}
                </Text>
              </View>
            )}
          />
        )}
      </View>

    </ScrollView>
  );
}

/* -------------------------------- STYLES ------------------------------ */

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 14,
    color: '#034a67',
    textDecorationLine: 'underline',
  },

  /* Nudge */
  nudgeBox: {
    backgroundColor: "#f1c40f",
    margin: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
  },
  nudgeText: { color: "#034a67", fontSize: 13, flex: 1 },

  /* Balance Card */
  balanceCard: {
    margin: 16,
    backgroundColor: "#2e7d32",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { color: "#ffffffaa", fontSize: 12 },
  balance: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  subLabel: { color: "#ffffffaa", fontSize: 10, marginTop: 4 },

  /* Savings Goal */
  goalCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2e7d32",
    backgroundColor: "#fff",
  },
  goalHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  goalTitle: { color: "#034a67", fontSize: 16, flex: 1 },
  badge: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 12 },

  progressBackground: {
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginVertical: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#2e7d32",
    borderRadius: 6,
  },

  goalFooter: { flexDirection: "row", justifyContent: "space-between" },
  grayText: { color: "#777", fontSize: 12 },
  greenText: { color: "#2e7d32", fontSize: 14, fontWeight: "500" },
  redText: { color: "red", fontSize: 14, fontWeight: "500" },

  /* Gamification */
  gamificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    paddingTop: 15
  },
  gamificationCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#f7f7f7",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  emoji: { fontSize: 26 },
  gamificationValue: { fontSize: 20, color: "#034a67" },
  gamificationLabel: { fontSize: 12, color: "#777" },

  /* Forecast */
  sectionTitle: {
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 8,
    color: "#034a67",
    fontSize: 16,
    fontWeight: "600",
  },
  forecastCard: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  forecastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
    alignItems: "center",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowLabel: { color: "#555", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 6 },
  insightText: {
    fontSize: 12,
    color: "#666",
    marginVertical: 2,
    lineHeight: 18,
  },

  /* Alerts */
  alertCardOrange: {
    backgroundColor: "#fff5e6",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0ad4e",
    flexDirection: "row",
    gap: 10,
  },
  alertCardBlue: {
    backgroundColor: "#eaf4ff",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#5dade2",
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  alertText: { flex: 1, color: "#333", fontSize: 13 },

  /* Transactions */
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#034a67',
    backgroundColor: '#fff',
  },
  filterButtonText: {
    color: '#034a67',
    fontSize: 14,
    fontWeight: '500',
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: 8,
    gap: 4,
  },
  filterChipActive: {
    backgroundColor: '#034a67',
    borderColor: '#034a67',
  },
  filterChipIcon: {
    fontSize: 14,
  },
  filterChipText: {
    fontSize: 13,
    color: '#555',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  transactionsCard: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    minHeight: 100,

  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#034a67',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#034a67',
  },
  clearFilterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionRow: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  txIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#f2f2f2",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  txName: { color: "#034a67", fontSize: 14 },
  txMeta: { color: "#777", fontSize: 12 },
  txAmount: { fontSize: 14, fontWeight: "600" },
});

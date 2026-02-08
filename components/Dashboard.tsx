import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { Zap, Wallet, Target, TrendingUp, TrendingDown, Filter } from "lucide-react-native";
import { aiApi, DashboardResponse, DashboardTransaction } from "../services/api";

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

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transaction filtering state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await aiApi.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
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
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#034a67" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error || !dashboardData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>⚠️ {error || 'Failed to load dashboard'}</Text>
        <TouchableOpacity onPress={() => fetchDashboardData()}>
          <Text style={styles.retryText}>Tap to retry</Text>
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
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#034a67']}
          tintColor="#034a67"
        />
      }
    >

      {/* AI Smart Nudge */}
      <View style={styles.nudgeBox}>
        <Icon name="zap" size={20} color="#034a67" />
        <Text style={styles.nudgeText}>
          <Text style={{ fontWeight: "bold" }}>{dashboardData.nudge.title}</Text> {dashboardData.nudge.message}
        </Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.label}>Current Balance</Text>
          <Text style={styles.balance}>₹{dashboardData.balance.totalBalance.toLocaleString("en-IN")}</Text>
          <Text style={styles.subLabel}>{dashboardData.balance.accountCount} accounts • Last synced: {new Date(dashboardData.balance.lastSyncedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <Icon name="wallet" size={36} color="#ffffffaa" />
      </View>

      {/* Savings Goal */}
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Icon name="target" size={20} color="#2e7d32" />
          <Text style={styles.goalTitle}>Monthly Savings Goal</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{Math.round(savingsProgress)}%</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${savingsProgress}%` },
            ]}
          />
        </View>

        <View style={styles.goalFooter}>
          <Text style={styles.grayText}>₹{dashboardData.savingsGoal.totalSaved.toLocaleString("en-IN")} saved</Text>
          <Text style={styles.greenText}>₹{dashboardData.savingsGoal.totalTarget.toLocaleString("en-IN")} goal</Text>
        </View>
      </View>

      {/* Gamification Boxes */}
      <View style={styles.gamificationRow}>
        <View style={styles.gamificationCard}>
          <Text style={styles.emoji}>🔥</Text>
          <Text style={styles.gamificationValue}>{dashboardData.gamification.currentStreak}</Text>
          <Text style={styles.gamificationLabel}>Day Streak</Text>
        </View>

        <View style={styles.gamificationCard}>
          <Text style={styles.emoji}>🏆</Text>
          <Text style={styles.gamificationValue}>{dashboardData.gamification.totalBadges}</Text>
          <Text style={styles.gamificationLabel}>Badges</Text>
        </View>

        <View style={styles.gamificationCard}>
          <Text style={styles.emoji}>⭐</Text>
          <Text style={styles.gamificationValue}>{dashboardData.gamification.activeChallenges.length}</Text>
          <Text style={styles.gamificationLabel}>Challenges</Text>
        </View>
      </View>

      {/* Forecast */}
      <Text style={styles.sectionTitle}>This Month's Forecast</Text>
      <View style={styles.forecastCard}>

        <View style={styles.forecastRow}>
          <View style={styles.rowLeft}>
            <Icon name="trending-up" size={18} color="green" />
            <Text style={styles.rowLabel}>Expected Income</Text>
          </View>
          <Text style={styles.greenText}>+₹{dashboardData.forecast.projected_income.toLocaleString("en-IN")}</Text>
        </View>

        <View style={styles.forecastRow}>
          <View style={styles.rowLeft}>
            <Icon name="trending-down" size={18} color="red" />
            <Text style={styles.rowLabel}>Predicted Expenses</Text>
          </View>
          <Text style={styles.redText}>-₹{dashboardData.forecast.projected_expense.toLocaleString("en-IN")}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.forecastRow}>
          <Text style={styles.rowLabel}>Net Savings</Text>
          <Text style={dashboardData.forecast.projected_savings >= 0 ? styles.greenText : styles.redText}>
            {dashboardData.forecast.projected_savings >= 0 ? '+' : ''}₹{dashboardData.forecast.projected_savings.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Forecast Insights */}
        {dashboardData.forecast.insights.length > 0 && (
          <View style={{ marginTop: 12 }}>
            {dashboardData.forecast.insights.map((insight, index) => (
              <Text key={index} style={styles.insightText}>• {insight}</Text>
            ))}
          </View>
        )}

      </View>

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Alerts & Reminders</Text>
          {dashboardData.alerts.map((alert: any, index: number) => (
            <View key={index} style={styles.alertCardOrange}>
              <Icon name="alert-circle" size={18} color="#d35400" />
              <Text style={styles.alertText}>{alert.message}</Text>
            </View>
          ))}
        </>
      )}

      {/* Recent Transactions */}
      <View style={styles.transactionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} color="#034a67" />
          <Text style={styles.filterButtonText}>Filter</Text>
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
              !selectedCategory && styles.filterChipActive
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.filterChipText,
              !selectedCategory && styles.filterChipTextActive
            ]}>
              All
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.filterChipIcon}>{getCategoryIcon(category)}</Text>
              <Text style={[
                styles.filterChipText,
                selectedCategory === category && styles.filterChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Transactions List */}
      <View style={styles.transactionsCard}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📭</Text>
            <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
            <Text style={styles.emptyStateText}>
              {selectedCategory
                ? `No transactions in ${selectedCategory} category`
                : 'Connect your bank account to see transactions'}
            </Text>
            {selectedCategory && (
              <TouchableOpacity
                style={styles.clearFilterButton}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={styles.clearFilterText}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.transactionRow}>
                <View style={styles.txIcon}>
                  <Text style={{ fontSize: 18 }}>{getCategoryIcon(item.category)}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.txName}>{item.merchant || item.description.substring(0, 30)}</Text>
                  <Text style={styles.txMeta}>
                    {item.category} • {formatDate(item.txnDate)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    { color: item.direction === 'CREDIT' ? "green" : "#034a67" },
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
    padding: 12,
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

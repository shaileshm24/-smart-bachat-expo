import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Card } from "react-native-paper";
import {
  TrendingDown,
  TrendingUp,
  Search,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react-native";
import { bankApi, Transaction, TransactionFilters, TransactionResponse } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";

// Date filter options
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

interface CategoryTransactionsProps {
  category: string;
  onBack: () => void;
}

// Helper to convert paisa to rupees
const paisaToRupees = (paisa: number): number => paisa / 100;

// Format rupees with Indian locale
const formatRupees = (amount: number): string => {
  const rupees = paisaToRupees(amount);
  return rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Get date range based on filter
const getDateRange = (filter: DateFilter): { startDate?: string; endDate?: string } => {
  const today = new Date();
  const formatDateStr = (d: Date) => d.toISOString().split('T')[0];
  
  switch (filter) {
    case 'today':
      return { startDate: formatDateStr(today), endDate: formatDateStr(today) };
    case 'week': {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { startDate: formatDateStr(weekAgo), endDate: formatDateStr(today) };
    }
    case 'month': {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { startDate: formatDateStr(monthAgo), endDate: formatDateStr(today) };
    }
    default:
      return {};
  }
};

// Group transactions by date category
interface DateGroup {
  label: string;
  transactions: Transaction[];
  totalAmount: number;
}

const groupTransactionsByDate = (transactions: Transaction[]): DateGroup[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const groups: { [key: string]: Transaction[] } = {
    'Today': [],
    'Yesterday': [],
    'Last 7 Days': [],
    'This Month': [],
    'Older': [],
  };

  transactions.forEach(txn => {
    const txnDate = new Date(txn.txnDate);
    txnDate.setHours(0, 0, 0, 0);

    if (txnDate.getTime() === today.getTime()) {
      groups['Today'].push(txn);
    } else if (txnDate.getTime() === yesterday.getTime()) {
      groups['Yesterday'].push(txn);
    } else if (txnDate >= weekAgo) {
      groups['Last 7 Days'].push(txn);
    } else if (txnDate >= monthStart) {
      groups['This Month'].push(txn);
    } else {
      groups['Older'].push(txn);
    }
  });

  return Object.entries(groups)
    .filter(([_, txns]) => txns.length > 0)
    .map(([label, txns]) => ({
      label,
      transactions: txns,
      totalAmount: txns.reduce((sum, t) => sum + (t.direction === 'DEBIT' ? t.amount : -t.amount), 0),
    }));
};

export default function CategoryTransactions({ category, onBack }: CategoryTransactionsProps) {
  const { colors, isDark } = useTheme();
  
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Today', 'Yesterday']));
  const [summary, setSummary] = useState<{ totalExpenses: number; totalIncome: number; count: number }>({
    totalExpenses: 0,
    totalIncome: 0,
    count: 0,
  });

  // Date filter options
  const dateFilters: { key: DateFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: '7 Days' },
    { key: 'month', label: 'Month' },
  ];

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = getDateRange(dateFilter);
      const filters: TransactionFilters = {
        category,
        size: 500,
        ...dateRange,
        ...(searchQuery ? { search: searchQuery } : {}),
      };

      const response: TransactionResponse = await bankApi.getTransactions(filters);
      setTransactions(response.transactions);
      setSummary({
        totalExpenses: response.summary.totalExpenses,
        totalIncome: response.summary.totalIncome,
        count: response.totalCount,
      });
    } catch (err: any) {
      if (err?.sessionExpired) return;
      setError(err?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [category, dateFilter, searchQuery]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length >= 2) {
        fetchTransactions();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(transactions);
  }, [transactions]);

  // Toggle group expansion
  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  // Render transaction item
  const renderTransaction = (t: Transaction) => (
    <View key={t.id} style={[styles.transactionRow, { borderColor: colors.border }]}>
      <View
        style={[
          styles.txIconCircle,
          {
            backgroundColor: t.direction === 'DEBIT'
              ? (isDark ? 'rgba(248,113,113,0.2)' : '#fee2e2')
              : (isDark ? 'rgba(74,222,128,0.2)' : '#dcfce7'),
          },
        ]}
      >
        {t.direction === 'DEBIT' ? (
          <TrendingDown size={18} color={colors.error} />
        ) : (
          <TrendingUp size={18} color={colors.success} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.txName, { color: colors.text }]} numberOfLines={1}>
          {t.merchant || t.description.substring(0, 30)}
        </Text>
        <Text style={[styles.txMeta, { color: colors.textMuted }]}>
          {t.txnType} • {formatDate(t.txnDate)}
        </Text>
      </View>
      <Text style={[styles.txAmount, { color: t.direction === 'DEBIT' ? colors.error : colors.success }]}>
        {t.direction === 'DEBIT' ? '-' : '+'}₹{formatRupees(t.amount)}
      </Text>
    </View>
  );

  if (loading && transactions.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Summary Card */}
      <View style={styles.summaryContainer}>
        <Card style={[styles.summaryCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Spent</Text>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                ₹{formatRupees(summary.totalExpenses)}
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Income</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                ₹{formatRupees(summary.totalIncome)}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
          <Search size={18} color={colors.placeholder} />
          <TextInput
            style={[styles.searchInput, { color: colors.inputText }]}
            placeholder="Search by description or amount..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Date Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {dateFilters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setDateFilter(filter.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: dateFilter === filter.key ? colors.secondary : colors.backgroundSecondary,
                  borderColor: dateFilter === filter.key ? colors.secondary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: dateFilter === filter.key ? '#fff' : colors.text },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {error}</Text>
          <TouchableOpacity onPress={fetchTransactions} style={[styles.retryButton, { borderColor: colors.secondary }]}>
            <Text style={{ color: colors.secondary }}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Transaction Groups */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {groupedTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No transactions found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          groupedTransactions.map(group => (
            <View key={group.label} style={styles.groupContainer}>
              {/* Group Header */}
              <TouchableOpacity
                onPress={() => toggleGroup(group.label)}
                style={[styles.groupHeader, { backgroundColor: colors.backgroundSecondary }]}
              >
                <View style={styles.groupHeaderLeft}>
                  {expandedGroups.has(group.label) ? (
                    <ChevronDown size={20} color={colors.textSecondary} />
                  ) : (
                    <ChevronRight size={20} color={colors.textSecondary} />
                  )}
                  <Text style={[styles.groupLabel, { color: colors.text }]}>{group.label}</Text>
                  <View style={[styles.countBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={styles.countBadgeText}>{group.transactions.length}</Text>
                  </View>
                </View>
                <Text style={[styles.groupTotal, { color: group.totalAmount > 0 ? colors.error : colors.success }]}>
                  {group.totalAmount > 0 ? '-' : '+'}₹{formatRupees(Math.abs(group.totalAmount))}
                </Text>
              </TouchableOpacity>

              {/* Group Transactions */}
              {expandedGroups.has(group.label) && (
                <Card style={[styles.groupCard, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
                  {group.transactions.map(renderTransaction)}
                </Card>
              )}
            </View>
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  filterContainer: {
    paddingTop: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  scrollView: {
    flex: 1,
    paddingTop: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  groupContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  groupTotal: {
    fontSize: 14,
    fontWeight: '600',
  },
  groupCard: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  txIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  txName: {
    fontSize: 14,
    fontWeight: '500',
  },
  txMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});


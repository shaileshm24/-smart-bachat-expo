import React, { useMemo, useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { Card, Button, Badge } from "react-native-paper";
import { TrendingDown, TrendingUp, ChevronRight } from "lucide-react-native";
import { bankApi, Transaction } from "../services/api";
import { useTheme } from "../contexts/ThemeContext";
import { getCategoryConfig } from "../utils/categoryIcons";

// Helper to convert paisa to rupees
const paisaToRupees = (paisa: number): number => paisa / 100;

// Format rupees with Indian locale
const formatRupees = (paisa: number): string => {
  const rupees = paisaToRupees(paisa);
  return rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Module-level cache to persist data across tab switches
let cachedTransactions: Transaction[] = [];
let cachedPageSize = 20;

// Page size options
const PAGE_SIZE_OPTIONS = [20, 50, 100];

interface ExpensesProps {
  onNavigateToCategoryDetails?: (category: string) => void;
}

export function Expenses({ onNavigateToCategoryDetails }: ExpensesProps) {
  const { colors, isDark } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>(cachedTransactions);
  const [loading, setLoading] = useState<boolean>(cachedTransactions.length === 0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(cachedPageSize);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch if we don't have cached data
    if (cachedTransactions.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      fetchAllTransactions();
    }
  }, []);

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch a large batch of transactions using new API
      const response = await bankApi.getTransactions({ page: 0, size: 1000 });
      setTransactions(response.transactions);
      cachedTransactions = response.transactions;
    } catch (err: any) {
      if (err?.sessionExpired) {
        return;
      }
      setError(err?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    hasFetched.current = false;
    setCurrentPage(0);
    fetchAllTransactions();
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    cachedPageSize = newSize;
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Derive categories + totals from real transactions (convert paisa to rupees)
  const categories = useMemo(() => {
    const map = new Map<string, { spent: number; count: number }>();
    transactions.forEach((t) => {
      const key = t.category || "OTHER";
      const current = map.get(key) || { spent: 0, count: 0 };
      const delta = t.direction === "DEBIT" ? paisaToRupees(t.amount) : 0;
      map.set(key, { spent: current.spent + delta, count: current.count + 1 });
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      spent: value.spent,
      count: value.count,
    }));
  }, [transactions]);

  // Calculate pagination
  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalTransactions);

  // Get current page's transactions
  const paginatedTransactions = useMemo(
    () => transactions.slice(startIndex, endIndex),
    [transactions, startIndex, endIndex]
  );

  const totalSpent = useMemo(
    () =>
      transactions
        .filter((t) => t.direction === "DEBIT")
        .reduce((sum, t) => sum + paisaToRupees(t.amount), 0),
    [transactions]
  );

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(0);

      if (currentPage > 2) pages.push('...');

      // Show pages around current
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push('...');

      // Always show last page
      if (totalPages > 1) pages.push(totalPages - 1);
    }
    return pages;
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading expenses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {error}</Text>
        <Button mode="contained" onPress={() => { setLoading(true); setError(null); }}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ paddingBottom: 20, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.secondary]}
          tintColor={colors.secondary}
        />
      }
    >
      {/* Monthly Overview with Refresh Button */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16, paddingTop: 15 }}>
        <Card style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.monthTitle, { color: colors.text }]}>This Month</Text>
            <View style={styles.headerActions}>
              {/* <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                <RefreshCw size={18} color={colors.secondary} />
              </TouchableOpacity> */}
              <Badge style={[styles.redBadge, { backgroundColor: isDark ? 'rgba(248,113,113,0.25)' : '#fee2e2' }]}>
                {`-₹${totalSpent.toLocaleString('en-IN')}`}
              </Badge>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={{ color: colors.textSecondary }}>Total Spent</Text>
              <Text style={[styles.blueText, { color: colors.secondary }]}>₹{totalSpent.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Category Breakdown */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Breakdown</Text>

        {categories.map((category, index) => {
          const config = getCategoryConfig(category.name);
          const IconComponent = config.icon;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (onNavigateToCategoryDetails) {
                  onNavigateToCategoryDetails(category.name);
                }
              }}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.row}>
                  <View style={[styles.iconCircle, { backgroundColor: config.bgColor }]}>
                    <IconComponent size={20} color={config.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                    <Text style={[styles.categorySub, { color: colors.textSecondary }]}>
                      ₹{category.spent.toLocaleString("en-IN")} • {category.count} txns
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.textMuted} />
                </View>
                <View style={[styles.progressBg, { backgroundColor: colors.backgroundSecondary }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((category.spent / totalSpent) * 100, 100)}%`,
                        backgroundColor: config.color,
                      },
                    ]}
                  />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Transactions */}
      <View style={{ padding: 16 }}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
              All Transactions
            </Text>
            <Text style={[styles.txCountText, { color: colors.textMuted }]}>
              Showing {startIndex + 1}-{endIndex} of {totalTransactions} transaction{totalTransactions !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Page Size Selector */}
        <View style={styles.pageSizeContainer}>
          <Text style={[styles.pageSizeLabel, { color: colors.textSecondary }]}>Per page:</Text>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => handlePageSizeChange(size)}
              style={[
                styles.pageSizeButton,
                {
                  backgroundColor: pageSize === size ? colors.secondary : 'transparent',
                  borderColor: colors.secondary,
                },
              ]}
            >
              <Text style={{ color: pageSize === size ? '#fff' : colors.secondary, fontSize: 12 }}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          {paginatedTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No transactions found.
              </Text>
            </View>
          ) : (
            <>
              {paginatedTransactions.map((t) => (
                <View key={t.id} style={[styles.transactionRow, { borderColor: colors.border }]}>
                  <View
                    style={[
                      styles.txIconCircle,
                      { backgroundColor: t.direction === 'DEBIT' ? (isDark ? 'rgba(248,113,113,0.2)' : '#fee2e2') : (isDark ? 'rgba(74,222,128,0.2)' : '#dcfce7') },
                    ]}
                  >
                    {t.direction === 'DEBIT' ? (
                      <TrendingDown size={20} color={colors.error} />
                    ) : (
                      <TrendingUp size={20} color={colors.success} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.txName, { color: colors.text }]}>
                      {t.merchant || t.description.substring(0, 30)}
                    </Text>
                    <Text style={[styles.txCategory, { color: colors.textSecondary }]}>
                      {t.category} • {t.txnType}
                    </Text>
                    <Text style={[styles.txTime, { color: colors.textMuted }]}>
                      {new Date(t.txnDate).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <Text style={[styles.txAmount, { color: t.direction === 'DEBIT' ? colors.error : colors.success }]}>
                    {t.direction === 'DEBIT' ? '-' : '+'}₹{formatRupees(t.amount)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </Card>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            {/* Previous Button */}
            <TouchableOpacity
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              style={[
                styles.paginationButton,
                {
                  borderColor: colors.border,
                  opacity: currentPage === 0 ? 0.4 : 1,
                },
              ]}
            >
              <Text style={{ color: colors.text }}>←</Text>
            </TouchableOpacity>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNum, index) => (
              typeof pageNum === 'string' ? (
                <Text key={`ellipsis-${index}`} style={[styles.paginationEllipsis, { color: colors.textMuted }]}>
                  {pageNum}
                </Text>
              ) : (
                <TouchableOpacity
                  key={pageNum}
                  onPress={() => handlePageChange(pageNum)}
                  style={[
                    styles.paginationButton,
                    {
                      backgroundColor: currentPage === pageNum ? colors.secondary : 'transparent',
                      borderColor: currentPage === pageNum ? colors.secondary : colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: currentPage === pageNum ? '#fff' : colors.text, fontSize: 12 }}>
                    {pageNum + 1}
                  </Text>
                </TouchableOpacity>
              )
            ))}

            {/* Next Button */}
            <TouchableOpacity
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              style={[
                styles.paginationButton,
                {
                  borderColor: colors.border,
                  opacity: currentPage === totalPages - 1 ? 0.4 : 1,
                },
              ]}
            >
              <Text style={{ color: colors.text }}>→</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  card: {
    padding: 16,
    borderWidth: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshButton: {
    padding: 8,
  },
  monthTitle: { fontSize: 16, fontWeight: "600" },
  redBadge: { paddingHorizontal: 6 },
  txCountText: { fontSize: 12, marginTop: 2 },
  blueText: { fontWeight: "600" },
  sectionTitle: { marginVertical: 10, fontSize: 16, fontWeight: "600" },
  categoryCard: {
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  categoryName: { fontSize: 14 },
  categorySub: { fontSize: 12 },
  progressBg: { width: "100%", height: 8, borderRadius: 8 },
  progressFill: { height: 8, borderRadius: 8 },
  transactionRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
  },
  txIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  txName: { fontSize: 14 },
  txCategory: { fontSize: 12 },
  txTime: { fontSize: 11 },
  txAmount: { fontSize: 14, fontWeight: "600" },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
  },
  pageSizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  pageSizeLabel: {
    fontSize: 12,
    marginRight: 4,
  },
  pageSizeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 6,
  },
  paginationButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationEllipsis: {
    paddingHorizontal: 4,
    fontSize: 12,
  },
});

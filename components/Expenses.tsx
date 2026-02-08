import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Button, Badge } from "react-native-paper";
import { TrendingDown } from "lucide-react-native";

export function Expenses() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: "Food & Dining", spent: 8420, budget: 10000, icon: "🍔", color: "#2e7d32" },
    { name: "Shopping", spent: 12350, budget: 15000, icon: "🛒", color: "#034a67" },
    { name: "Transport", spent: 3200, budget: 5000, icon: "🚗", color: "#f1c40f" },
    { name: "Bills & Utilities", spent: 5600, budget: 6000, icon: "📱", color: "#e74c3c" },
    { name: "Entertainment", spent: 2800, budget: 4000, icon: "🎬", color: "#9b59b6" },
    { name: "Health", spent: 1500, budget: 3000, icon: "⚕️", color: "#16a085" },
  ];

  const transactions = [
    { name: "Swiggy", category: "Food & Dining", amount: 450, time: "Today, 2:15 PM", method: "UPI" },
    { name: "Zomato", category: "Food & Dining", amount: 420, time: "Today, 1:30 PM", method: "UPI" },
    { name: "Amazon", category: "Shopping", amount: 2499, time: "Today, 10:15 AM", method: "Card" },
    { name: "Metro Card Recharge", category: "Transport", amount: 500, time: "Yesterday, 9:00 AM", method: "UPI" },
    { name: "Uber", category: "Transport", amount: 180, time: "Yesterday, 8:45 PM", method: "UPI" },
    { name: "Netflix", category: "Entertainment", amount: 649, time: "Nov 15, 2025", method: "Card" },
    { name: "Electricity Bill", category: "Bills & Utilities", amount: 1850, time: "Nov 14, 2025", method: "UPI" },
    { name: "Myntra", category: "Shopping", amount: 3499, time: "Nov 13, 2025", method: "Card" },
  ];

  const filteredTransactions = selectedCategory
    ? transactions.filter((t) => t.category === selectedCategory)
    : transactions;

  return (
    <ScrollView style={{ paddingBottom: 20 }}>
      {/* Monthly Overview */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Card style={{ padding: 16 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.monthTitle}>November 2025</Text>
            <Badge style={styles.redBadge}>-₹34,370</Badge>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>Budget</Text>
              <Text style={styles.blueText}>₹43,000</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>Remaining</Text>
              <Text style={styles.greenText}>₹8,630</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Category Breakdown */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>

        {categories.map((category, index) => {
          const percentage = (category.spent / category.budget) * 100;
          const isOver = percentage > 100;

          return (
            <TouchableOpacity key={index} onPress={() =>
              setSelectedCategory(selectedCategory === category.name ? null : category.name)
            }>
              <Card
                style={[
                  styles.categoryCard,
                  selectedCategory === category.name && styles.categoryCardSelected,
                ]}
              >
                <View style={styles.row}>
                  <View style={styles.iconCircle}>
                    <Text style={{ fontSize: 20 }}>{category.icon}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categorySub}>
                      ₹{category.spent.toLocaleString("en-IN")} / ₹
                      {category.budget.toLocaleString("en-IN")}
                    </Text>
                  </View>

                  <Text style={{ color: isOver ? "red" : "#2e7d32" }}>
                    {Math.round(percentage)}%
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(percentage, 100)}%`, backgroundColor: isOver ? "red" : "#2e7d32" },
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
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `${selectedCategory} Transactions` : "All Transactions"}
          </Text>

          {selectedCategory && (
            <Button mode="text" textColor="#2e7d32" onPress={() => setSelectedCategory(null)}>
              Clear
            </Button>
          )}
        </View>

        <Card>
          {filteredTransactions.map((t, i) => (
            <View key={i} style={styles.transactionRow}>
              <View style={styles.redCircle}>
                <TrendingDown size={22} color="red" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.txName}>{t.name}</Text>
                <Text style={styles.txCategory}>{t.category} • {t.method}</Text>
                <Text style={styles.txTime}>{t.time}</Text>
              </View>

              <Text style={styles.txAmount}>-₹{t.amount.toLocaleString("en-IN")}</Text>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  monthTitle: { fontSize: 16, color: "#034a67", fontWeight: "600" },
  redBadge: { backgroundColor: "#ffdddd", color: "#c00", paddingHorizontal: 6 },
  grayText: { color: "#666" },
  blueText: { color: "#034a67", fontWeight: "600" },
  greenText: { color: "#2e7d32", fontWeight: "600" },
  sectionTitle: { marginVertical: 10, fontSize: 16, color: "#034a67", fontWeight: "600" },
  categoryCard: { padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#ddd" },
  categoryCardSelected: { borderColor: "#2e7d32", backgroundColor: "#eaf5ec" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#f2f2f2",
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  categoryName: { fontSize: 14, color: "#034a67" },
  categorySub: { fontSize: 12, color: "#666" },
  progressBg: { width: "100%", height: 8, backgroundColor: "#eee", borderRadius: 8 },
  progressFill: { height: 8, borderRadius: 8 },
  transactionRow: { flexDirection: "row", padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  redCircle: {
    width: 40, height: 40, backgroundColor: "#ffe5e5",
    borderRadius: 20, alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  txName: { fontSize: 14, color: "#034a67" },
  txCategory: { fontSize: 12, color: "#666" },
  txTime: { fontSize: 11, color: "#999" },
  txAmount: { fontSize: 14, color: "red", fontWeight: "600" },
});

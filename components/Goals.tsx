import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Card, Button, Badge, ProgressBar, Portal, Modal } from "react-native-paper";
import { Plus, Calendar, TrendingUp, Sparkles } from "lucide-react-native";

export  function Goals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      target: 100000,
      current: 45000,
      deadline: "Dec 2025",
      category: "Safety Net",
      icon: "🛡️",
      aiPrediction: "On track to complete by Nov 30",
      suggestedMonthly: 5000,
    },
    {
      id: 2,
      name: "Vacation to Goa",
      target: 50000,
      current: 28000,
      deadline: "Jan 2026",
      category: "Travel",
      icon: "✈️",
      aiPrediction: "Need ₹3,500/month to achieve goal",
      suggestedMonthly: 3500,
    },
    {
      id: 3,
      name: "New Laptop",
      target: 80000,
      current: 52000,
      deadline: "Feb 2026",
      category: "Electronics",
      icon: "💻",
      aiPrediction: "Achievable with current savings rate",
      suggestedMonthly: 4000,
    },
    {
      id: 4,
      name: "Wedding Gift Fund",
      target: 25000,
      current: 10000,
      deadline: "Mar 2026",
      category: "Personal",
      icon: "💝",
      aiPrediction: "On track - 3 months ahead of schedule",
      suggestedMonthly: 2000,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");

  return (
    <ScrollView style={{ flex: 1, paddingBottom: 20 }}>
      {/* Header with Add Goal */}
      <View style={{ padding: 16 }}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Savings Goals</Text>
            <Text style={styles.headerSubtitle}>
              Track and achieve your financial goals
            </Text>
          </View>
          <Button
        
            mode="contained"
            buttonColor="#2e7d32"
            onPress={() => setModalVisible(true)}
            style={{ height: 36 }}
            icon={() => <Plus size={16} color="white" />}
          >
            Add Goal
          </Button>
        </View>

        {/* Add Goal Modal */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Create New Goal</Text>
            <TextInput
              placeholder="Goal Name"
              value={newGoalName}
              onChangeText={setNewGoalName}
              style={styles.input}
            />
            <TextInput
              placeholder="Target Amount (₹)"
              value={newGoalTarget}
              onChangeText={setNewGoalTarget}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Target Date"
              value={newGoalDeadline}
              onChangeText={setNewGoalDeadline}
              style={styles.input}
            />
            <Button
              mode="contained"
              buttonColor="#2e7d32"
              style={{ marginTop: 12 }}
              onPress={() => {
                setGoals([
                  ...goals,
                  {
                    id: goals.length + 1,
                    name: newGoalName,
                    target: Number(newGoalTarget),
                    current: 0,
                    deadline: newGoalDeadline,
                    category: "General",
                    icon: "🎯",
                    aiPrediction: "",
                    suggestedMonthly: 0,
                  },
                ]);
                setModalVisible(false);
                setNewGoalName("");
                setNewGoalTarget("");
                setNewGoalDeadline("");
              }}
            >
              Create Goal
            </Button>
          </Modal>
        </Portal>

        {/* AI Suggestion */}
        <Card style={[styles.card, { backgroundColor: "#fff8e5", borderColor: "#f1c40f33" }]}>
          <View style={styles.rowStart}>
            <Sparkles size={20} color="#f39c12" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.aiText}>
                <Text style={{ fontWeight: "bold" }}>AI Suggestion: </Text>
                Based on your spending patterns, you can save an additional ₹3,200 this month by reducing dining out expenses.
              </Text>
              <Button
                mode="contained"
                buttonColor="#2e7d32"
                style={{ marginTop: 6, height: 32 }}
              >
                Apply to Goals
              </Button>
            </View>
          </View>
        </Card>
      </View>

      {/* Overall Progress */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Card style={[styles.card, { backgroundColor: "#e6f2e7", borderColor: "#2e7d3220" }]}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Total Progress</Text>
            <Badge style={{ backgroundColor: "#2e7d32", color: "#fff" }}>53%</Badge>
          </View>
          <View style={{ marginTop: 8 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>Total Saved</Text>
              <Text style={styles.greenText}>₹1,35,000</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>Total Goal</Text>
              <Text style={styles.blueText}>₹2,55,000</Text>
            </View>
            <ProgressBar progress={0.53} color="#2e7d32" style={{ height: 8, marginTop: 8 }} />
          </View>
        </Card>
      </View>

      {/* Goals List */}
      <View style={{ paddingHorizontal: 16 }}>
        {goals.map((goal) => {
          const progress = goal.current / goal.target;
          const remaining = goal.target - goal.current;

          return (
            <Card key={goal.id} style={styles.card}>
              {/* Header */}
              <View style={[styles.rowStart, { marginBottom: 8 }]}>
                <View style={styles.goalIcon}>{goal.icon}</View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.goalTitle}>{goal.name}</Text>
                  <View style={styles.rowStart}>
                    <Badge style={{ borderWidth: 1, borderColor: "#034a6733", marginRight: 6 }}>
                      {goal.category}
                    </Badge>
                    <View style={styles.rowStart}>
                      <Calendar size={12} color="#034a67" />
                      <Text style={{ fontSize: 12, color: "#666", marginLeft: 4 }}>{goal.deadline}</Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontWeight: "600", color: "#2e7d32" }}>{Math.round(progress * 100)}%</Text>
              </View>

              {/* Progress Bar */}
              <ProgressBar progress={progress} color="#2e7d32" style={{ height: 8, marginBottom: 8 }} />

              {/* Amount */}
              <View style={styles.rowBetween}>
                <Text style={styles.grayText}>
                  ₹{goal.current.toLocaleString("en-IN")} / ₹{goal.target.toLocaleString("en-IN")}
                </Text>
                <Text style={styles.blueText}>₹{remaining.toLocaleString("en-IN")} remaining</Text>
              </View>

              {/* AI Prediction */}
              <Card style={[styles.card, { backgroundColor: "#fff8e5", borderColor: "#f1c40f33", marginTop: 8 }]}>
                <View style={styles.rowStart}>
                  <TrendingUp size={16} color="#f39c12" />
                  <Text style={[styles.aiText, { marginLeft: 6, fontSize: 12 }]}>
                    <Text style={{ fontWeight: "bold" }}>AI Prediction: </Text>
                    {goal.aiPrediction}
                  </Text>
                </View>
              </Card>

              {/* Suggested Monthly */}
              <Button
                mode="contained"
                buttonColor="#034a67"
                style={{ marginTop: 8 }}
                icon={() => <Plus size={14} color="white" />}
              >
                Add ₹{goal.suggestedMonthly.toLocaleString("en-IN")} (Suggested)
              </Button>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  headerTitle: { fontSize: 18, color: "#034a67", fontWeight: "600" },
  headerSubtitle: { fontSize: 12, color: "#666" },
  card: { padding: 12, marginBottom: 12 },
  rowStart: { flexDirection: "row", alignItems: "flex-start" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  aiText: { fontSize: 12, color: "#034a67" },
  sectionTitle: { fontSize: 14, color: "#034a67", fontWeight: "600" },
  grayText: { fontSize: 12, color: "#666" },
  greenText: { fontSize: 12, color: "#2e7d32", fontWeight: "600" },
  blueText: { fontSize: 12, color: "#034a67", fontWeight: "600" },
  goalIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#2e7d32", justifyContent: "center", alignItems: "center" },
  goalTitle: { fontSize: 14, color: "#034a67", fontWeight: "600" },
  modalContainer: { backgroundColor: "white", padding: 16, marginHorizontal: 16, borderRadius: 12 },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#034a67", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, marginBottom: 8 },
});

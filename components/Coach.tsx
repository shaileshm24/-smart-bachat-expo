import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Sparkles,
  Send,
  TrendingUp,
  PiggyBank,
  Target,
} from "lucide-react-native";
import { Card } from "react-native-paper";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

export function Coach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Financial Coach. How can I assist you today?",
      sender: "ai",
      timestamp: "10:00 AM",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const quickSuggestions = [
    { icon: <TrendingUp size={16} color="#2e7d32" />, text: "How can I save more?" },
    { icon: <PiggyBank size={16} color="#034a67" />, text: "Analyze my spending" },
    { icon: <Target size={16} color="#f1c40f" />, text: "Goal suggestions" },
  ];

  const aiResponses: { [key: string]: string } = {
    "how can i save more":
      "Based on your spending patterns, here are 3 ways to save more:\n\n1. 🍔 Food & Dining: You spent ₹8,420 this month. Try cooking at home.\n2. 🛒 Shopping: Wait 24 hours before purchases.\n3. 🚗 Transport: Use metro instead of Uber.\n\nPotential savings: ₹4,700/month! 🎯",

    "analyze my spending":
      "Here's your spending analysis:\n\n📊 Top Categories:\n• Shopping: ₹12,350\n• Food & Dining: ₹8,420\n• Utilities: ₹5,600\n\nYou're 15% below last month!",

    "goal suggestions":
      "Recommended Goals:\n\n1. Emergency Fund: ₹1,00,000 (₹5,000/month)\n2. Vacation Fund: ₹50,000 (₹3,500/month)\n3. Gadget: ₹40,000 (₹2,500/month)",
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputMessage.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // AI reply
    setTimeout(() => {
      const normalized = messageText.toLowerCase();
      let reply =
        "I can help you save better, analyze spending, or set goals.";

      if (normalized.includes("save")) reply = aiResponses["how can i save more"];
      else if (normalized.includes("spend") || normalized.includes("analyze"))
        reply = aiResponses["analyze my spending"];
      else if (normalized.includes("goal"))
        reply = aiResponses["goal suggestions"];

      const aiMessage: Message = {
        id: messages.length + 2,
        text: reply,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 900);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Sparkles size={28} color="white" />
        </View>

        <View>
          <Text style={styles.title}>AI Financial Coach</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online & Ready</Text>
          </View>
        </View>
      </View>

      {/* Quick Suggestions */}
      <View style={styles.suggestionContainer}>
        <Text style={styles.smallLabel}>Quick actions:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickSuggestions.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestionButton}
              onPress={() => handleSendMessage(s.text)}
            >
              {s.icon}
              <Text style={styles.suggestionText}>{s.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesArea}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.sender === "user" ? styles.userMessageRow : styles.aiMessageRow,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.sender === "user"
                  ? styles.userBubble
                  : styles.aiBubble,
              ]}
            >
              {msg.sender === "ai" && (
                <View style={styles.aiHeader}>
                  <Sparkles size={14} color="#f1c40f" />
                  <Text style={styles.aiLabel}>AI Coach</Text>
                </View>
              )}

              <Text style={styles.messageText}>{msg.text}</Text>
              <Text
                style={[
                  styles.timestamp,
                  msg.sender === "user"
                    ? { color: "rgba(255,255,255,0.7)" }
                    : { color: "#666" },
                ]}
              >
                {msg.timestamp}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Tip Card */}
      <View style={{ paddingHorizontal: 16 }}>
        <Card style={styles.tipCard}>
          <View style={styles.tipRow}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              <Text style={{ fontWeight: "bold" }}>Today's Tip:</Text> Automate
              your savings! Transfers on payday help reach goals faster.
            </Text>
          </View>
        </Card>
      </View>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Ask me anything..."
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSendMessage()}
        >
          <Send size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 18,
    color: "#034a67",
    fontWeight: "600",
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  onlineDot: {
    width: 8,
    height: 8,
    backgroundColor: "green",
    borderRadius: 5,
    marginRight: 5,
  },

  onlineText: {
    fontSize: 12,
    color: "green",
  },

  suggestionContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  smallLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },

  suggestionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderColor: "#ccc",
    marginRight: 8,
  },

  suggestionText: {
    marginLeft: 6,
    fontSize: 12,
  },

  messagesArea: {
    flex: 1,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  messageWrapper: {
    marginVertical: 6,
    flexDirection: "row",
  },

  userMessageRow: {
    justifyContent: "flex-end",
  },

  aiMessageRow: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 15,
  },

  userBubble: {
    backgroundColor: "#2e7d32",
  },

  aiBubble: {
    backgroundColor: "#e8e8e8",
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  aiLabel: {
    marginLeft: 6,
    fontSize: 11,
    color: "#2e7d32",
  },

  messageText: {
    fontSize: 14,
    color: "black",
  },

  timestamp: {
    marginTop: 4,
    fontSize: 10,
  },

  tipCard: {
    padding: 10,
    backgroundColor: "#fff8d6",
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f1c40f",
  },

  tipRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tipEmoji: {
    fontSize: 20,
    marginRight: 8,
  },

  tipText: {
    fontSize: 12,
    flex: 1,
    color: "#034a67",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 5,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: "#2e7d32",
    borderRadius: 25,
    padding: 10,
  },
});

# Backend API Requirements - Based on Screen Design

## 📱 **Screen Analysis Summary**

The SmartBachat app has 5 main screens with the following features:

1. **Dashboard (Home)** - Overview, balance, transactions, forecasts, alerts
2. **Expenses** - Category breakdown, transaction management
3. **Goals** - Savings goals, progress tracking, AI predictions
4. **Coach** - AI chatbot for financial advice
5. **More** - Profile management, achievements, settings, reports

---

## 🔧 **Required Backend APIs by Service**

### **1. UAM Service (Port 8081) - User & Authentication**

#### **Already Implemented:**
- ✅ `POST /api/v1/auth/register` - User registration
- ✅ `POST /api/v1/auth/login` - User login
- ✅ `POST /api/v1/auth/refresh` - Token refresh

#### **New APIs Needed:**

```
📌 User Profile Management
GET    /api/v1/users/profile              - Get user profile
PUT    /api/v1/users/profile              - Update user profile
POST   /api/v1/users/profile/avatar       - Upload profile picture

📌 Multi-Profile Support (Personal, Joint, Business)
GET    /api/v1/users/profiles             - List all profiles
POST   /api/v1/users/profiles             - Create new profile
PUT    /api/v1/users/profiles/{id}        - Update profile
DELETE /api/v1/users/profiles/{id}        - Delete profile
POST   /api/v1/users/profiles/{id}/switch - Switch active profile

📌 Notification Settings
GET    /api/v1/users/settings/notifications - Get notification preferences
PUT    /api/v1/users/settings/notifications - Update notification preferences

📌 App Settings
GET    /api/v1/users/settings              - Get all user settings
PUT    /api/v1/users/settings              - Update user settings
```

---

### **2. Core Service (Port 8080) - Transactions & Banking**

#### **Already Implemented:**
- ✅ `POST /api/v1/bank/connect` - Initiate bank connection
- ✅ `GET /api/v1/bank/consent/{id}/status` - Check consent status (assumed)

#### **New APIs Needed:**

```
📌 Dashboard APIs
GET    /api/v1/dashboard/summary           - Get dashboard overview
  Response: {
    currentBalance: number,
    predictedBalance: number,
    monthlySavings: number,
    savingsGoal: number,
    savingsProgress: number
  }

GET    /api/v1/dashboard/nudges            - Get AI smart nudges
  Response: {
    message: string,
    type: "success" | "warning" | "info",
    actionable: boolean
  }

GET    /api/v1/dashboard/forecast          - Get monthly forecast
  Response: {
    expectedIncome: number,
    predictedExpenses: number,
    netSavings: number
  }

GET    /api/v1/dashboard/alerts            - Get alerts & reminders
  Response: [
    {
      type: "emi" | "festival" | "bill" | "custom",
      title: string,
      message: string,
      dueDate: string,
      amount: number
    }
  ]

📌 Transaction APIs
GET    /api/v1/transactions                - Get all transactions
  Query params: ?page=1&limit=20&category=Food&startDate=2025-11-01&endDate=2025-11-30

POST   /api/v1/transactions                - Add manual transaction
  Body: {
    name: string,
    category: string,
    amount: number,
    type: "income" | "expense",
    date: string,
    paymentMethod: "UPI" | "Card" | "Cash" | "NetBanking"
  }

PUT    /api/v1/transactions/{id}           - Update transaction
DELETE /api/v1/transactions/{id}           - Delete transaction

GET    /api/v1/transactions/recent         - Get recent transactions (last 10)

📌 Category & Budget APIs
GET    /api/v1/categories                  - Get all expense categories
  Response: [
    {
      name: string,
      icon: string,
      spent: number,
      budget: number,
      color: string
    }
  ]

PUT    /api/v1/categories/{name}/budget    - Update category budget
  Body: { budget: number }

GET    /api/v1/categories/breakdown        - Get category-wise breakdown
  Query params: ?month=2025-11&profileId=1

📌 Export APIs
GET    /api/v1/transactions/export/pdf     - Export transactions as PDF
  Query params: ?startDate=2025-11-01&endDate=2025-11-30

GET    /api/v1/transactions/export/csv     - Export transactions as CSV

📌 Balance & Account APIs
GET    /api/v1/accounts                    - Get all linked accounts
GET    /api/v1/accounts/{id}/balance       - Get account balance
GET    /api/v1/accounts/{id}/transactions  - Get account-specific transactions
```

---

### **3. AI Advisory Service (Port 8089) - AI Features**

#### **New APIs Needed:**

```
📌 AI Coach/Chatbot APIs
POST   /api/v1/ai/chat                     - Send message to AI coach
  Body: {
    message: string,
    conversationId: string (optional)
  }
  Response: {
    reply: string,
    conversationId: string,
    suggestions: string[]
  }

GET    /api/v1/ai/suggestions              - Get quick action suggestions
  Response: [
    { text: string, icon: string, action: string }
  ]

GET    /api/v1/ai/tips/daily               - Get daily financial tip
  Response: {
    tip: string,
    category: string
  }

📌 Savings Goals APIs
GET    /api/v1/goals                       - Get all savings goals
  Response: [
    {
      id: number,
      name: string,
      target: number,
      current: number,
      deadline: string,
      category: string,
      icon: string,
      aiPrediction: string,
      suggestedMonthly: number
    }
  ]

POST   /api/v1/goals                       - Create new goal
  Body: {
    name: string,
    target: number,
    deadline: string,
    category: string
  }

PUT    /api/v1/goals/{id}                  - Update goal
DELETE /api/v1/goals/{id}                  - Delete goal

POST   /api/v1/goals/{id}/contribute       - Add money to goal
  Body: { amount: number }

GET    /api/v1/goals/{id}/prediction       - Get AI prediction for goal
  Response: {
    prediction: string,
    achievable: boolean,
    suggestedMonthly: number,
    estimatedCompletion: string
  }

GET    /api/v1/goals/suggestions           - Get AI-suggested goals
  Response: [
    {
      name: string,
      target: number,
      suggestedMonthly: number,
      reason: string
    }
  ]

📌 AI Analysis APIs
POST   /api/v1/ai/analyze/spending         - Analyze spending patterns
  Body: { month: string, profileId: number }
  Response: {
    topCategories: Array<{ category: string, amount: number }>,
    insights: string[],
    recommendations: string[],
    comparisonWithLastMonth: number
  }

GET    /api/v1/ai/forecast/monthly         - Get monthly forecast
  Response: {
    expectedIncome: number,
    predictedExpenses: number,
    netSavings: number,
    confidence: number
  }

POST   /api/v1/ai/recommendations          - Get personalized recommendations
  Response: {
    savingOpportunities: Array<{
      category: string,
      currentSpend: number,
      suggestedSpend: number,
      potentialSavings: number
    }>,
    actionableSteps: string[]
  }
```

---

## 🎮 **Gamification APIs (Can be in UAM or AI Service)**

```
📌 Achievements & Badges
GET    /api/v1/gamification/badges         - Get all badges
  Response: [
    {
      id: number,
      name: string,
      icon: string,
      description: string,
      earned: boolean,
      earnedDate: string (if earned)
    }
  ]

GET    /api/v1/gamification/streak         - Get current streak
  Response: {
    currentStreak: number,
    longestStreak: number,
    lastActivityDate: string
  }

GET    /api/v1/gamification/level          - Get user level
  Response: {
    level: number,
    xp: number,
    xpToNextLevel: number,
    title: string
  }

GET    /api/v1/gamification/challenges     - Get active challenges
  Response: [
    {
      id: number,
      name: string,
      description: string,
      progress: number,
      target: number,
      reward: string,
      expiresAt: string
    }
  ]
```

---

## 📊 **Reports & Analytics APIs (Core Service)**

```
GET    /api/v1/reports/monthly             - Get monthly report
  Query params: ?month=2025-11&profileId=1
  Response: {
    totalIncome: number,
    totalExpenses: number,
    netSavings: number,
    categoryBreakdown: Array<{ category: string, amount: number, percentage: number }>,
    topTransactions: Array<Transaction>,
    comparisonWithLastMonth: {
      income: number,
      expenses: number,
      savings: number
    }
  }

GET    /api/v1/reports/yearly              - Get yearly report
GET    /api/v1/reports/custom              - Get custom date range report
  Query params: ?startDate=2025-01-01&endDate=2025-12-31
```

---

## 🔔 **Notification APIs (UAM Service)**

```
GET    /api/v1/notifications               - Get all notifications
POST   /api/v1/notifications/{id}/read     - Mark notification as read
DELETE /api/v1/notifications/{id}          - Delete notification
POST   /api/v1/notifications/read-all      - Mark all as read
```

---

## 📝 **Summary of API Count**

| Service | Existing APIs | New APIs Needed | Total |
|---------|--------------|-----------------|-------|
| **UAM Service** | 3 | 10 | 13 |
| **Core Service** | 2 | 23 | 25 |
| **AI Advisory Service** | 0 | 15 | 15 |
| **Total** | **5** | **48** | **53** |

---

## 🎯 **Priority Order for Development**

### **Phase 1: Core Functionality (High Priority)**
1. Dashboard summary API
2. Transactions CRUD APIs
3. Categories & budget APIs
4. Recent transactions API
5. Account balance API

### **Phase 2: AI Features (Medium Priority)**
6. AI chat API
7. Goals CRUD APIs
8. AI predictions for goals
9. Spending analysis API
10. Monthly forecast API

### **Phase 3: Advanced Features (Low Priority)**
11. Export APIs (PDF/CSV)
12. Gamification APIs
13. Reports APIs
14. Multi-profile support

---

## 🔗 **Next Steps**

1. **Review this document** with your backend team
2. **Prioritize APIs** based on your development timeline
3. **Design database schema** for new entities (goals, categories, badges, etc.)
4. **Implement Phase 1 APIs** first to get basic functionality working
5. **Test with frontend** as each phase is completed

Would you like me to:
- Create detailed API specifications with request/response examples?
- Design database schema for these features?
- Create API integration code in the frontend?


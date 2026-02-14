// API Configuration and Service Layer
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment configuration
// For production/development builds, use Cloudflare Tunnel URLs
// For Expo Go, use local network IPs
const USE_CLOUDFLARE_TUNNEL = false; // Set to true when using EAS build

// Cloudflare Tunnel URLs (update these when you start the tunnels)
const CLOUDFLARE_URLS = {
  UAM: 'https://rpm-post-nose-bike.trycloudflare.com',      // Port 8081
  CORE: 'https://reduce-pushed-trader-grill.trycloudflare.com',    // Port 8080
  AI: 'https://dark-barbie-ate-charges.trycloudflare.com',        // Port 8089
};

// Determine the correct API URL based on platform and port
const getServiceUrl = (port: number) => {
  // If using Cloudflare Tunnel (for EAS builds), return the tunnel URL
  if (USE_CLOUDFLARE_TUNNEL) {
    const serviceMap: { [key: number]: string } = {
      8081: CLOUDFLARE_URLS.UAM,
      8080: CLOUDFLARE_URLS.CORE,
      8089: CLOUDFLARE_URLS.AI,
    };
    return serviceMap[port];
  }

  const debuggerHost = Constants.expoConfig?.hostUri;

  // If running on Expo Go (has debuggerHost), use the host IP
  if (debuggerHost) {
    const hostIP = debuggerHost.split(':')[0];
    return `http://${hostIP}:${port}`;
  }

  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return `http://10.0.2.2:${port}`;
  } else if (Platform.OS === 'ios') {
    // iOS simulator - use 127.0.0.1 instead of localhost for better compatibility
    return `http://127.0.0.1:${port}`;
  } else if (Platform.OS === 'web') {
    // Web browser - use computer's IP
    return `http://192.168.31.58:${port}`;
  } else {
    // Physical device or unknown - use computer's IP address
    return `http://192.168.31.58:${port}`;
  }
};

// Service URLs for different microservices
const UAM_SERVICE_URL = getServiceUrl(8081);      // Authentication service
const CORE_SERVICE_URL = getServiceUrl(8080);     // Bank/Account Aggregator service
const AI_SERVICE_URL = getServiceUrl(8089);       // AI Advisory service

// For backward compatibility
const API_BASE_URL = UAM_SERVICE_URL;

// Storage abstraction layer - Uses AsyncStorage for persistence
// Also supports getting token from Redux store

// Store reference - will be set after store initialization
let _reduxStore: any = null;
let _storeInitialized = false;

// Function to set the store reference (called from App.tsx)
export const setReduxStore = (store: any) => {
  _reduxStore = store;
  _storeInitialized = true;
};

// Helper to get Redux store
const getStore = () => {
  if (_storeInitialized) {
    return _reduxStore;
  }
  return null;
};

// Force logout - dispatches forceLogout action to Redux store
const dispatchForceLogout = () => {
  const store = getStore();
  if (store) {
    // Import dynamically to avoid circular dependency
    const { forceLogout } = require('../store/slices/authSlice');
    store.dispatch(forceLogout());
  }
};

class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Silent fail - don't expose storage errors
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      // First, try to get from Redux store (for tokens)
      const reduxStore = getStore();
      if (reduxStore) {
        const state = reduxStore.getState();

        if (key === 'accessToken') {
          const reduxToken = state.auth?.tokens?.accessToken;
          if (reduxToken) return reduxToken;
        }
        if (key === 'refreshToken') {
          const reduxToken = state.auth?.tokens?.refreshToken;
          if (reduxToken) return reduxToken;
        }
        if (key === 'userId') {
          const userId = state.auth?.user?.userId;
          if (userId) return userId;
        }
        if (key === 'userEmail') {
          const email = state.auth?.user?.email;
          if (email) return email;
        }
      }

      // Fallback to AsyncStorage
      return await AsyncStorage.getItem(key);
    } catch (error) {
      // Silent fail - don't expose storage errors
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Silent fail - don't expose storage errors
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      // Silent fail - don't expose storage errors
    }
  }
}

export const storage = new StorageService();

// API Response Types
export interface ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  profileId: string;
  email: string;
  displayName: string;
  roles: string[];
  // Error response fields (when login fails)
  status?: string;
  message?: string;
}

export interface LoginRequest {
  username: string; // email or mobile
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  mobileNumber?: string;
  firstName?: string;
  lastName?: string;
}

export interface BankConnectionRequest {
  mobileNumber: string;
}

export interface BankConnectionResponse {
  bankAccountId: string;
  consentId: string;
  redirectUrl: string;
  status: string;
  message: string | null;
}

// Dashboard API Types
export interface DashboardNudge {
  title: string;
  message: string;
  type: 'NEUTRAL' | 'SUCCESS' | 'WARNING' | 'INFO';
  actionType: string;
  category: string | null;
}

export interface DashboardBalance {
  totalBalance: number;
  accountCount: number;
  lastSyncedAt: string;
  currency: string;
}

export interface DashboardSavingsGoal {
  totalTarget: number;
  totalSaved: number;
  progressPercent: number;
  suggestedMonthlySaving: number;
  activeGoals: number;
  goalsOnTrack: number;
  goalsBehindSchedule: number;
}

export interface DashboardGamification {
  currentStreak: number;
  longestStreak: number;
  recentBadges: any[];
  activeChallenges: any[];
  level: number;
  xp: number;
  totalBadges: number;
}

export interface DashboardForecast {
  trend: 'UP' | 'DOWN' | 'STABLE';
  insights: string[];
  projected_expense: number;
  projected_income: number;
  projected_savings: number;
  change_percent: number;
  avg_monthly_expense: number;
  avg_monthly_income: number;
  savings_rate: number;
  confidence_score: number;
  forecast_method: string;
}

export interface DashboardTransaction {
  id: string;
  statementId: string | null;
  profileId: string;
  txnDate: string;
  amount: number;
  direction: 'CREDIT' | 'DEBIT';
  currency: string;
  txnType: string;
  description: string;
  merchant: string | null;
  balance: number;
  category: string;
  subCategory: string | null;
}

	// Alias for reuse in other screens (e.g., Expenses)
	export type Transaction = DashboardTransaction;

// Transaction API types
export interface TransactionFilters {
  page?: number;
  size?: number;
  category?: string;
  startDate?: string;  // Format: YYYY-MM-DD
  endDate?: string;    // Format: YYYY-MM-DD
  direction?: 'CREDIT' | 'DEBIT';
  search?: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  creditCount: number;
  debitCount: number;
}

export interface TransactionResponse {
  transactions: Transaction[];
  summary: TransactionSummary;
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface DashboardResponse {
  totalSavings: number;
  nudge: DashboardNudge;
  balance: DashboardBalance;
  savingsGoal: DashboardSavingsGoal;
  gamification: DashboardGamification;
  forecast: DashboardForecast;
  alerts: any[];
  recentTransactions: DashboardTransaction[];
  generatedAt: string;
}

// API Client with automatic token refresh
class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await storage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Token refresh logic - always uses UAM service for auth
  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await storage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Always use UAM service URL for token refresh (auth is on port 8081)
      const response = await fetch(`${UAM_SERVICE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result: AuthResponse = await response.json();

      if (result.accessToken) {
        await storage.setItem('accessToken', result.accessToken);
        if (result.refreshToken) {
          await storage.setItem('refreshToken', result.refreshToken);
        }
        return result.accessToken;
      }

      return null;
    } catch (error) {
      // Clear tokens on refresh failure and force logout
      await storage.removeItem('accessToken');
      await storage.removeItem('refreshToken');
      // Dispatch force logout to update Redux state and redirect to login
      dispatchForceLogout();
      return null;
    }
  }

  // Queue requests while token is being refreshed
  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach(callback => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Convert technical error messages to user-friendly messages
   */
  private getUserFriendlyError(status: number, serverMessage: string, endpoint: string): string {
    // Check for specific error patterns in server message
    const lowerMessage = (serverMessage || '').toLowerCase();

    // Database/timeout errors
    if (lowerMessage.includes('jdbc') ||
        lowerMessage.includes('sql') ||
        lowerMessage.includes('timed out') ||
        lowerMessage.includes('timeout')) {
      return 'Service is temporarily unavailable. Please try again in a moment.';
    }

    // Authentication errors
    if (status === 401) {
      if (endpoint.includes('/login')) {
        return 'Invalid email or password. Please try again.';
      }
      return 'Your session has expired. Please login again.';
    }

    // Authorization errors
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }

    // Not found errors
    if (status === 404) {
      return 'The requested resource was not found.';
    }

    // Validation errors
    if (status === 400) {
      // If server provides a clear message, use it (but sanitize)
      if (serverMessage &&
          !lowerMessage.includes('exception') &&
          !lowerMessage.includes('error') &&
          serverMessage.length < 100) {
        return serverMessage;
      }
      return 'Invalid request. Please check your input and try again.';
    }

    // Conflict errors (e.g., duplicate email)
    if (status === 409) {
      if (endpoint.includes('/register') || endpoint.includes('/signup')) {
        return 'An account with this email already exists.';
      }
      return 'This action conflicts with existing data.';
    }

    // Server errors
    if (status >= 500) {
      return 'Server error. Please try again later.';
    }

    // Rate limiting
    if (status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    // Default fallback
    return 'Something went wrong. Please try again.';
  }

  // Make request with automatic retry on 401
  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    requiresAuth = false,
    isRetry = false
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = requiresAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };

      const options: RequestInit = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
      }

	      const response = await fetch(url, options);

	      const isUnauthorized = response.status === 401 || response.status === 403;

	      // Handle 401 Unauthorized or 403 Forbidden - token expired/invalid
	      // Some backends return 403 for expired JWT instead of 401
	      if (isUnauthorized && requiresAuth && !isRetry) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            // Retry the original request with new token
            return this.makeRequest<T>(method, endpoint, data, requiresAuth, true);
          } else {
            // Refresh failed - forceLogout already dispatched in refreshToken()
            // Don't throw error, just return a rejected promise that won't show error UI
            // The app will redirect to login via the Redux state change
            return Promise.reject({ sessionExpired: true, message: 'Session expired. Please login again.' });
          }
	        } else {
	          // Wait for ongoing refresh to complete
	          return new Promise((resolve, reject) => {
	            this.subscribeTokenRefresh(async (token: string) => {
	              try {
	                const result = await this.makeRequest<T>(method, endpoint, data, requiresAuth, true);
	                resolve(result);
	              } catch (error) {
	                reject(error);
	              }
	            });
	          });
	        }
	      }

	      // If we already retried with a refreshed token and still get 401/403,
	      // treat this as a hard session expiry and force logout instead of surfacing
	      // a "session expired" error on screens like Dashboard.
	      if (isUnauthorized && requiresAuth && isRetry) {
	        await storage.removeItem('accessToken');
	        await storage.removeItem('refreshToken');
	        dispatchForceLogout();
	        return Promise.reject({ sessionExpired: true, message: 'Session expired. Please login again.' });
	      }

      let result;
      try {
        const responseText = await response.text();
        result = JSON.parse(responseText);
      } catch (parseError: any) {
        // User-friendly message instead of technical error
        throw new Error('Unable to process server response. Please try again.');
      }

      if (!response.ok) {
        // Return user-friendly error messages based on status code
        const userMessage = this.getUserFriendlyError(response.status, result.message, endpoint);
        throw new Error(userMessage);
      }

      return result;
    } catch (error: any) {
      // If session expired, preserve the sessionExpired flag for the caller
      if (error?.sessionExpired) {
        throw error;
      }

      // If error already has a user-friendly message, use it
      if (error.message && !error.message.includes('JDBC') && !error.message.includes('SQL')) {
        throw error;
      }

      // Provide user-friendly error messages
      if (error.message === 'Network request failed') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }

      // Generic user-friendly message for unexpected errors
      throw new Error('Something went wrong. Please try again later.');
    }
  }

  async post<T = any>(endpoint: string, data?: any, requiresAuth = false): Promise<T> {
    return this.makeRequest<T>('POST', endpoint, data, requiresAuth);
  }

  async get<T = any>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>('GET', endpoint, undefined, requiresAuth);
  }

  async put<T = any>(endpoint: string, data?: any, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>('PUT', endpoint, data, requiresAuth);
  }

  async delete<T = any>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, requiresAuth);
  }
}

// Create separate API clients for each service
const uamClient = new ApiClient(UAM_SERVICE_URL);      // Port 8081 - Authentication
const coreClient = new ApiClient(CORE_SERVICE_URL);    // Port 8080 - Bank/AA
const aiClient = new ApiClient(AI_SERVICE_URL);        // Port 8089 - AI Advisory

// Auth API - Uses UAM Service (Port 8081)
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return uamClient.post<AuthResponse>('/api/v1/auth/login', credentials);
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return uamClient.post<AuthResponse>('/api/v1/auth/register', data);
  },

  async logout(): Promise<void> {
    await uamClient.post('/api/v1/auth/logout', {}, true);
    await storage.removeItem('accessToken');
    await storage.removeItem('refreshToken');
  },
};

// Bank Connection API - Uses Core Service (Port 8080)
export const bankApi = {
  async initiateConnection(data: BankConnectionRequest): Promise<BankConnectionResponse> {
    return coreClient.post<BankConnectionResponse>('/api/v1/bank/connect', data, true);
  },

  async getAccounts(): Promise<any> {
    return coreClient.get('/api/v1/bank/accounts', true);
  },

  /**
   * Fetch paginated transactions with optional filters.
   * Uses Bearer token authentication (userId extracted from JWT on backend).
   *
   * @param filters - Optional filters for pagination, category, date range, direction, search
   * @returns TransactionResponse with transactions array, summary, and pagination info
   */
  async getTransactions(filters?: TransactionFilters): Promise<TransactionResponse> {
    const params = new URLSearchParams();

    // Add pagination params (with defaults)
    params.append('page', String(filters?.page ?? 0));
    params.append('size', String(filters?.size ?? 50));

    // Add optional filter params
    if (filters?.category) {
      params.append('category', filters.category);
    }
    if (filters?.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters?.endDate) {
      params.append('endDate', filters.endDate);
    }
    if (filters?.direction) {
      params.append('direction', filters.direction);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const endpoint = `/api/transactions?${params.toString()}`;
    return coreClient.get<TransactionResponse>(endpoint, true);
  },

  async getDashboard(): Promise<DashboardResponse> {
    return coreClient.get<DashboardResponse>('/api/v1/dashboard', true);
  },
};

// AI Advisory API - Uses AI Service (Port 8089)
export const aiApi = {
  async getAdvice(data: any): Promise<any> {
    return aiClient.post('/api/v1/ai/advice', data, true);
  },
};


// API Configuration and Service Layer
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Environment configuration
// For production/development builds, use Cloudflare Tunnel URLs
// For Expo Go, use local network IPs
const USE_CLOUDFLARE_TUNNEL = false; // Set to true when using EAS build
const DEBUG_MODE = true; // Set to false in production to hide technical logs

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
    const url = serviceMap[port];
    console.log(`☁️ Using Cloudflare Tunnel: ${url}`);
    return url;
  }

  const platform = Platform.OS;
  const manifest = Constants.expoConfig;
  const debuggerHost = Constants.expoConfig?.hostUri;

  console.log('🔧 Platform Detection:', {
    os: platform,
    debuggerHost,
    hostUri: Constants.expoConfig?.hostUri,
    isDevice: !Constants.isDevice ? 'Simulator/Emulator' : 'Physical Device'
  });

  // If running on Expo Go (has debuggerHost), use the host IP
  if (debuggerHost) {
    // Extract IP from debuggerHost (format: "192.168.31.58:8082")
    const hostIP = debuggerHost.split(':')[0];
    const url = `http://${hostIP}:${port}`;
    console.log(`📱 Detected Expo Go, using host IP: ${url}`);
    return url;
  }

  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    const url = `http://10.0.2.2:${port}`;
    console.log(`📱 Using Android Emulator URL: ${url}`);
    return url;
  } else if (Platform.OS === 'ios') {
    // iOS simulator - use 127.0.0.1 instead of localhost for better compatibility
    const url = `http://127.0.0.1:${port}`;
    console.log(`📱 Using iOS Simulator URL: ${url}`);
    return url;
  } else if (Platform.OS === 'web') {
    // Web browser - use computer's IP
    const url = `http://192.168.31.58:${port}`;
    console.log(`🌐 Using Web URL: ${url}`);
    return url;
  } else {
    // Physical device or unknown - use computer's IP address
    const url = `http://192.168.31.58:${port}`;
    console.log(`📱 Using Physical Device URL: ${url}`);
    return url;
  }
};

// Service URLs for different microservices
const UAM_SERVICE_URL = getServiceUrl(8081);      // Authentication service
const CORE_SERVICE_URL = getServiceUrl(8080);     // Bank/Account Aggregator service
const AI_SERVICE_URL = getServiceUrl(8089);       // AI Advisory service

console.log('🌐 Service URLs configured:', {
  UAM: UAM_SERVICE_URL,
  CORE: CORE_SERVICE_URL,
  AI: AI_SERVICE_URL
});

// For backward compatibility
const API_BASE_URL = UAM_SERVICE_URL;

// Storage abstraction layer - Simple in-memory storage for React Native
// This works without external dependencies
class StorageService {
  private storage: Map<string, string> = new Map();

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (DEBUG_MODE) console.log(`💾 Saving to storage: ${key}`);
      this.storage.set(key, value);
      if (DEBUG_MODE) console.log(`✅ Saved successfully: ${key} = ${value.substring(0, 30)}...`);
    } catch (error) {
      console.error(`❌ Storage error:`, error);
      throw error;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const value = this.storage.get(key) || null;
      if (DEBUG_MODE) console.log(`📖 Retrieved from storage: ${key} = ${value ? `${value.substring(0, 20)}...` : 'null'}`);
      return value;
    } catch (error) {
      console.error(`❌ Storage error:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      console.log(`🗑️ Removing from storage: ${key}`);
      this.storage.delete(key);
    } catch (error) {
      console.error(`❌ Storage removeItem error for ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      console.log('🗑️ Clearing all storage');
      this.storage.clear();
    } catch (error) {
      console.error('❌ Storage clear error:', error);
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
    console.log('🔑 Retrieved token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN FOUND');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Token refresh logic
  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await storage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
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
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      await storage.removeItem('accessToken');
      await storage.removeItem('refreshToken');
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
      if (DEBUG_MODE) console.log(`🌐 API Request: ${method} ${url}`);
      if (data && DEBUG_MODE) {
        console.log('📤 Request Data:', JSON.stringify(data, null, 2));
      }

      const headers = requiresAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };

      const options: RequestInit = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
      }

      if (DEBUG_MODE) {
        console.log('🔧 Fetch options:', JSON.stringify({
          method: options.method,
          headers: options.headers,
          hasBody: !!options.body,
          requiresAuth
        }, null, 2));
      }

      const response = await fetch(url, options);
      if (DEBUG_MODE) console.log(`📥 API Response Status: ${response.status} ${response.statusText}`);

      // Handle 401 Unauthorized - token expired
      if (response.status === 401 && requiresAuth && !isRetry) {
        console.log('🔄 Token expired, attempting refresh...');
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.refreshToken();
          this.isRefreshing = false;

          if (newToken) {
            this.onTokenRefreshed(newToken);
            // Retry the original request with new token
            return this.makeRequest<T>(method, endpoint, data, requiresAuth, true);
          } else {
            // Refresh failed, user needs to login again
            throw new Error('Session expired. Please login again.');
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

      let result;
      try {
        const responseText = await response.text();
        if (DEBUG_MODE) console.log('📄 Raw Response:', responseText.substring(0, 200));
        result = JSON.parse(responseText);
        if (DEBUG_MODE) console.log('✅ API Response:', JSON.stringify(result, null, 2));
      } catch (parseError: any) {
        if (DEBUG_MODE) console.error('❌ JSON Parse Error:', parseError.message);
        // User-friendly message instead of technical error
        throw new Error('Unable to process server response. Please try again.');
      }

      if (!response.ok) {
        // Log technical details for debugging (only in debug mode)
        if (DEBUG_MODE) {
          console.error('❌ API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            endpoint,
            message: result.message
          });
        }

        // Return user-friendly error messages based on status code
        const userMessage = this.getUserFriendlyError(response.status, result.message, endpoint);
        throw new Error(userMessage);
      }

      return result;
    } catch (error: any) {
      // Log technical details for debugging (only in debug mode)
      if (DEBUG_MODE) {
        console.error('❌ Network Error:', error.message || error);
        console.error('🔍 Error Details:', {
          endpoint,
          method,
          baseUrl: this.baseUrl,
          error: error.toString()
        });
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
    console.log('🔐 Calling UAM Service (8081) for login');
    return uamClient.post<AuthResponse>('/api/v1/auth/login', credentials);
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('🔐 Calling UAM Service (8081) for register');
    return uamClient.post<AuthResponse>('/api/v1/auth/register', data);
  },

  async logout(): Promise<void> {
    console.log('🔐 Calling UAM Service (8081) for logout');
    await uamClient.post('/api/v1/auth/logout', {}, true);
    await storage.removeItem('accessToken');
    await storage.removeItem('refreshToken');
  },
};

// Bank Connection API - Uses Core Service (Port 8080)
export const bankApi = {
  async initiateConnection(data: BankConnectionRequest): Promise<BankConnectionResponse> {
    console.log('🏦 Calling Core Service (8080) for bank connection');
    return coreClient.post<BankConnectionResponse>('/api/v1/bank/connect', data, true);
  },

  async getAccounts(): Promise<any> {
    console.log('🏦 Calling Core Service (8080) for accounts');
    return coreClient.get('/api/v1/bank/accounts', true);
  },

async getDashboard(): Promise<DashboardResponse> {
    console.log('🤖 Calling AI Service (8080) for dashboard');
    return coreClient.get<DashboardResponse>('/api/v1/dashboard', true);
  },
};

// AI Advisory API - Uses AI Service (Port 8089)
export const aiApi = {
  async getAdvice(data: any): Promise<any> {
    console.log('🤖 Calling AI Service (8089) for advice');
    return aiClient.post('/api/v1/ai/advice', data, true);
  },


};


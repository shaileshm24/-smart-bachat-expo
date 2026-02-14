import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { aiApi, DashboardResponse, DashboardTransaction, bankApi } from '../../services/api';

// Dashboard state interface
export interface DashboardState {
  data: DashboardResponse | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  selectedCategory: string | null;
  showFilters: boolean;
  lastFetched: number | null;
}

// Initial state
const initialState: DashboardState = {
  data: null,
  loading: false,
  refreshing: false,
  error: null,
  selectedCategory: null,
  showFilters: false,
  lastFetched: null,
};

// Async thunks
export const fetchDashboard = createAsyncThunk(
  'dashboard/fetch',
  async (isRefresh: boolean = false, { rejectWithValue }) => {
    try {
      const data = await bankApi.getDashboard();
      console.log("Dashboard data", data, "isRefresh", isRefresh);
      return { data, isRefresh };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load dashboard data');
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearDashboard: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state, action) => {
        const isRefresh = action.meta.arg;
        if (isRefresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.data = action.payload.data;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectFilteredTransactions = (state: { dashboard: DashboardState }): DashboardTransaction[] => {
  const { data, selectedCategory } = state.dashboard;
  
  if (!data?.recentTransactions) return [];
  
  if (!selectedCategory) {
    return data.recentTransactions;
  }
  
  return data.recentTransactions.filter(
    tx => tx.category === selectedCategory
  );
};

export const selectCategories = (state: { dashboard: DashboardState }): string[] => {
  const { data } = state.dashboard;
  
  if (!data?.recentTransactions) return [];
  
  const categories = new Set(
    data.recentTransactions.map(tx => tx.category)
  );
  return Array.from(categories).sort();
};

export const {
  setSelectedCategory,
  toggleFilters,
  setShowFilters,
  clearError,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;


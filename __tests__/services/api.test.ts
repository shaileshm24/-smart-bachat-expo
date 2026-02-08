import { storage } from '../../services/api';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock as any;

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should store and retrieve items', async () => {
    await storage.setItem('testKey', 'testValue');
    const value = await storage.getItem('testKey');
    expect(value).toBe('testValue');
  });

  test('should return null for non-existent keys', async () => {
    const value = await storage.getItem('nonExistent');
    expect(value).toBeNull();
  });

  test('should remove items', async () => {
    await storage.setItem('testKey', 'testValue');
    await storage.removeItem('testKey');
    const value = await storage.getItem('testKey');
    expect(value).toBeNull();
  });

  test('should clear all items', async () => {
    await storage.setItem('key1', 'value1');
    await storage.setItem('key2', 'value2');
    await storage.clear();
    const value1 = await storage.getItem('key1');
    const value2 = await storage.getItem('key2');
    expect(value1).toBeNull();
    expect(value2).toBeNull();
  });
});

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should make POST request without auth', async () => {
    const mockResponse = { status: 'SUCCESS', message: 'OK' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { authApi } = require('../../services/api');
    const result = await authApi.login({ username: 'test@example.com', password: 'password' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual(mockResponse);
  });

  test('should include auth token in requests', async () => {
    await storage.setItem('accessToken', 'test-token');

    const mockResponse = { status: 'SUCCESS', data: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { bankApi } = require('../../services/api');
    await bankApi.getAccounts();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/bank/accounts'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  test('should handle API errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    const { authApi } = require('../../services/api');
    
    await expect(
      authApi.login({ username: 'test@example.com', password: 'wrong' })
    ).rejects.toThrow('Invalid credentials');
  });

  test('should refresh token on 401 error', async () => {
    await storage.setItem('accessToken', 'expired-token');
    await storage.setItem('refreshToken', 'refresh-token');

    // First call returns 401
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        status: 401,
        ok: false,
        json: async () => ({ message: 'Unauthorized' }),
      })
      // Refresh token call succeeds
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'SUCCESS',
          accessToken: 'new-token',
          refreshToken: 'new-refresh-token',
        }),
      })
      // Retry original request succeeds
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'SUCCESS', data: [] }),
      });

    const { bankApi } = require('../../services/api');
    const result = await bankApi.getAccounts();

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ status: 'SUCCESS', data: [] });
    
    const newToken = await storage.getItem('accessToken');
    expect(newToken).toBe('new-token');
  });
});


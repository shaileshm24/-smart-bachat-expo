import { Linking } from 'react-native';
import { deepLinkingService } from '../../services/deepLinking';

// Mock React Native Linking
jest.mock('react-native', () => ({
  Linking: {
    getInitialURL: jest.fn(),
    addEventListener: jest.fn(),
    canOpenURL: jest.fn(),
    openURL: jest.fn(),
  },
}));

describe('Deep Linking Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize and handle initial URL', async () => {
    const mockUrl = 'smartbachat://consent?consentId=123&status=success';
    (Linking.getInitialURL as jest.Mock).mockResolvedValueOnce(mockUrl);
    (Linking.addEventListener as jest.Mock).mockReturnValueOnce({ remove: jest.fn() });

    const handler = jest.fn();
    deepLinkingService.registerHandler('consent', handler);

    await deepLinkingService.initialize();

    expect(Linking.getInitialURL).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith({
      consentId: '123',
      status: 'success',
    });
  });

  test('should register and call handlers', async () => {
    const handler = jest.fn();
    deepLinkingService.registerHandler('consent', handler);

    // Simulate URL event
    const mockUrl = 'smartbachat://consent?status=success';
    (deepLinkingService as any).handleUrl(mockUrl);

    expect(handler).toHaveBeenCalledWith({ status: 'success' });
  });

  test('should unregister handlers', () => {
    const handler = jest.fn();
    deepLinkingService.registerHandler('consent', handler);
    deepLinkingService.unregisterHandler('consent');

    const mockUrl = 'smartbachat://consent?status=success';
    (deepLinkingService as any).handleUrl(mockUrl);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should create deep link URLs', () => {
    const url = deepLinkingService.createUrl('consent', {
      consentId: '123',
      status: 'pending',
    });

    expect(url).toBe('smartbachat://consent?consentId=123&status=pending');
  });

  test('should parse URLs with query parameters', () => {
    const parsed = (deepLinkingService as any).parseUrl(
      'smartbachat://consent?consentId=123&status=success'
    );

    expect(parsed.path).toBe('consent');
    expect(parsed.queryParams).toEqual({
      consentId: '123',
      status: 'success',
    });
  });

  test('should parse HTTPS URLs', () => {
    const parsed = (deepLinkingService as any).parseUrl(
      'https://smartbachat.com/consent?consentId=456&status=failed'
    );

    expect(parsed.path).toBe('/consent');
    expect(parsed.queryParams).toEqual({
      consentId: '456',
      status: 'failed',
    });
  });

  test('should handle URLs without query parameters', () => {
    const parsed = (deepLinkingService as any).parseUrl('smartbachat://consent');

    expect(parsed.path).toBe('consent');
    expect(parsed.queryParams).toEqual({});
  });

  test('should check if URL can be opened', async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(true);

    const canOpen = await deepLinkingService.canOpenUrl('https://example.com');

    expect(Linking.canOpenURL).toHaveBeenCalledWith('https://example.com');
    expect(canOpen).toBe(true);
  });

  test('should open external URLs', async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(true);
    (Linking.openURL as jest.Mock).mockResolvedValueOnce(undefined);

    await deepLinkingService.openUrl('https://example.com');

    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  test('should throw error if URL cannot be opened', async () => {
    (Linking.canOpenURL as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      deepLinkingService.openUrl('invalid://url')
    ).rejects.toThrow('Cannot open URL');
  });

  test('should handle multiple handlers for different paths', () => {
    const consentHandler = jest.fn();
    const paymentHandler = jest.fn();

    deepLinkingService.registerHandler('consent', consentHandler);
    deepLinkingService.registerHandler('payment', paymentHandler);

    (deepLinkingService as any).handleUrl('smartbachat://consent?status=success');
    (deepLinkingService as any).handleUrl('smartbachat://payment?amount=100');

    expect(consentHandler).toHaveBeenCalledWith({ status: 'success' });
    expect(paymentHandler).toHaveBeenCalledWith({ amount: '100' });
  });

  test('should decode URL-encoded parameters', () => {
    const parsed = (deepLinkingService as any).parseUrl(
      'smartbachat://consent?message=Hello%20World&status=success'
    );

    expect(parsed.queryParams).toEqual({
      message: 'Hello World',
      status: 'success',
    });
  });
});


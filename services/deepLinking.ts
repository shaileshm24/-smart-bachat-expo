import { Linking } from 'react-native';

export interface DeepLinkParams {
  consentId?: string;
  status?: string;
  error?: string;
  [key: string]: any;
}

export type DeepLinkHandler = (params: DeepLinkParams) => void;

class DeepLinkingService {
  private handlers: Map<string, DeepLinkHandler> = new Map();
  private isInitialized = false;

  /**
   * Initialize deep linking service
   * Call this once in your app's root component
   */
  async initialize() {
    if (this.isInitialized) return;

    // Handle initial URL (app opened from link)
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      this.handleUrl(initialUrl);
    }

    // Listen for URL changes (app already open)
    const subscription = Linking.addEventListener('url', (event: { url: string }) => {
      this.handleUrl(event.url);
    });

    this.isInitialized = true;
  }

  /**
   * Register a handler for a specific path
   * @param path - The path to handle (e.g., 'consent', 'payment')
   * @param handler - Function to call when this path is matched
   */
  registerHandler(path: string, handler: DeepLinkHandler) {
    this.handlers.set(path, handler);
  }

  /**
   * Unregister a handler
   */
  unregisterHandler(path: string) {
    this.handlers.delete(path);
  }

  /**
   * Parse URL manually
   */
  private parseUrl(url: string): { path: string; queryParams: DeepLinkParams } {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const queryParams: DeepLinkParams = {};

      urlObj.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      return { path, queryParams };
    } catch (error) {
      // Fallback for custom schemes like smartbachat://
      const parts = url.split('://');
      if (parts.length > 1) {
        const [, rest] = parts;
        const [pathPart, queryPart] = rest.split('?');
        const queryParams: DeepLinkParams = {};

        if (queryPart) {
          queryPart.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
              queryParams[decodeURIComponent(key)] = decodeURIComponent(value);
            }
          });
        }

        return { path: pathPart || '', queryParams };
      }

      return { path: '', queryParams: {} };
    }
  }

  /**
   * Parse and handle incoming URL
   */
  private handleUrl(url: string) {
    try {
      const { path, queryParams } = this.parseUrl(url);

      // Handle different paths
      if (path) {
        const pathSegments = path.split('/').filter(Boolean);
        const mainPath = pathSegments[0];

        const handler = this.handlers.get(mainPath);
        if (handler) {
          handler(queryParams || {});
        }
        // Silent fail if no handler - don't expose internal routing
      }
    } catch (error) {
      // Silent fail - don't expose deep link errors
    }
  }

  /**
   * Create a deep link URL
   * @param path - The path (e.g., 'consent')
   * @param params - Query parameters
   */
  createUrl(path: string, params?: Record<string, string>): string {
    const scheme = 'smartbachat://';
    let url = `${scheme}${path}`;

    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Check if a URL can be opened
   */
  async canOpenUrl(url: string): Promise<boolean> {
    return await Linking.canOpenURL(url);
  }

  /**
   * Open a URL (external link)
   */
  async openUrl(url: string): Promise<void> {
    const canOpen = await this.canOpenUrl(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      throw new Error(`Cannot open URL: ${url}`);
    }
  }
}

// Export singleton instance
export const deepLinkingService = new DeepLinkingService();

// Convenience functions
export const initializeDeepLinking = () => deepLinkingService.initialize();
export const registerDeepLinkHandler = (path: string, handler: DeepLinkHandler) =>
  deepLinkingService.registerHandler(path, handler);
export const unregisterDeepLinkHandler = (path: string) =>
  deepLinkingService.unregisterHandler(path);
export const createDeepLink = (path: string, params?: Record<string, string>) =>
  deepLinkingService.createUrl(path, params);
export const openExternalUrl = (url: string) => deepLinkingService.openUrl(url);


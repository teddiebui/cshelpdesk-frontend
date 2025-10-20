// API Client với async fetch queue max capacity 5
import type { ApiEndpoints, ApiResponse, QueueConfig } from "./types";

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  credentials: "include" as RequestCredentials, // Include cookies (JSESSIONID)
} as const;

// Queue Configuration
export const QUEUE_CONFIG: QueueConfig = {
  maxCapacity: 5,
  retryAttempts: API_CONFIG.retries,
  retryDelay: API_CONFIG.retryDelay,
  timeout: API_CONFIG.timeout,
};

// API Endpoints
export const API_ENDPOINTS: ApiEndpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
    refresh: "/auth/refresh",
  },
  dashboard: {
    getStats: "/dashboard/stats",
    getTodayStaff: "/dashboard/today-staff",
    getTodayTickets: "/dashboard/today-tickets",
  },
  tickets: {
    list: "/tickets",
    create: "/tickets",
    update: "/tickets/:id",
    delete: "/tickets/:id",
    getById: "/tickets/:id",
  },
  customers: {
    list: "/customers",
    create: "/customers",
    update: "/customers/:id",
    delete: "/customers/:id",
    getById: "/customers/:id",
  },
  performance: {
    getMetrics: "/performance/metrics",
    getReports: "/performance/reports",
  },
  reports: {
    generate: "/reports/generate",
    download: "/reports/download/:id",
    list: "/reports",
  },
  settings: {
    get: "/settings",
    update: "/settings",
  },
};

// Default Headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest", // For Spring Security CSRF
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Utility function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Utility function to create fetch options with credentials
export const createFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    credentials: API_CONFIG.credentials,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };
};

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string | number | boolean>;
  timeout?: number;
  retry?: boolean; // Chỉ retry khi retry = true
}

interface QueueItem {
  id: string;
  url: string;
  options: RequestOptions;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retries: number;
}

class ApiClient {
  private queue: QueueItem[] = [];
  private processing: Set<string> = new Set();
  private readonly maxCapacity = 5;
  private readonly baseURL = API_CONFIG.baseURL;

  /**
   * Thêm request vào queue
   */
  private async addToQueue<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const id = this.generateId();
      const queueItem: QueueItem = {
        id,
        url,
        options,
        resolve,
        reject,
        retries: 0,
      };

      // Nếu queue đầy, xóa item cũ nhất
      if (this.queue.length >= this.maxCapacity) {
        const oldestItem = this.queue.shift();
        if (oldestItem) {
          oldestItem.reject(
            new Error("Request cancelled: Queue at max capacity")
          );
        }
      }

      this.queue.push(queueItem);
      this.processQueue();
    });
  }

  /**
   * Xử lý queue
   */
  private async processQueue(): Promise<void> {
    if (this.processing.size >= this.maxCapacity || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.processing.add(item.id);
    try {
      const result = await this.executeRequest(item);
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      this.processing.delete(item.id);
      this.processQueue();
    }
  }

  private async executeRequest(item: QueueItem): Promise<ApiResponse<any>> {
    const { url, options } = item;
    const fullUrl = this.buildURL(url, options.queryParams);
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      options.timeout || API_CONFIG.timeout
    );

    try {
      let body: string | FormData | undefined;
      let headers: Record<string, string> = {
        ...options.headers,
      };

      if (options.body) {
        if (options.body instanceof FormData) {
          body = options.body;
          // Không set Content-Type cho FormData, browser sẽ tự set
        } else {
          body = JSON.stringify(options.body);
          headers["Content-Type"] = DEFAULT_HEADERS["Content-Type"];
        }
      }

      const response = await fetch(
        fullUrl,
        createFetchOptions({
          method: options.method || "GET",
          headers,
          body,
          signal: controller.signal,
        })
      );

      clearTimeout(timeoutId);
      return (await response.json()) as ApiResponse<any>;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private urlCache = new Map<string, string>();

  private buildURL(
    url: string,
    queryParams?: Record<string, string | number | boolean>
  ): string {
    const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;

    if (!queryParams || Object.keys(queryParams).length === 0) {
      return fullUrl;
    }

    // Tạo cache key
    const cacheKey = `${fullUrl}?${JSON.stringify(queryParams)}`;
    if (this.urlCache.has(cacheKey)) {
      return this.urlCache.get(cacheKey)!;
    }

    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const result = queryString ? `${fullUrl}?${queryString}` : fullUrl;

    // Cache URL (giới hạn cache size)
    if (this.urlCache.size > 100) {
      const firstKey = this.urlCache.keys().next().value;
      if (firstKey) {
        this.urlCache.delete(firstKey);
      }
    }
    this.urlCache.set(cacheKey, result);

    return result;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods
  async get<T = any>(
    url: string,
    queryParams?: Record<string, string | number | boolean>,
    options?: Partial<RequestOptions>
  ): Promise<ApiResponse<T>> {
    return this.addToQueue<T>(url, { method: "GET", queryParams, ...options });
  }

  async post<T = any>(
    url: string,
    body?: any,
    queryParams?: Record<string, string | number | boolean>,
    options?: Partial<RequestOptions>
  ): Promise<ApiResponse<T>> {
    return this.addToQueue<T>(url, {
      method: "POST",
      body,
      queryParams,
      ...options,
    });
  }

  async put<T = any>(
    url: string,
    body?: any,
    queryParams?: Record<string, string | number | boolean>,
    options?: Partial<RequestOptions>
  ): Promise<ApiResponse<T>> {
    return this.addToQueue<T>(url, {
      method: "PUT",
      body,
      queryParams,
      ...options,
    });
  }

  async patch<T = any>(
    url: string,
    body?: any,
    queryParams?: Record<string, string | number | boolean>,
    options?: Partial<RequestOptions>
  ): Promise<ApiResponse<T>> {
    return this.addToQueue<T>(url, {
      method: "PATCH",
      body,
      queryParams,
      ...options,
    });
  }

  async delete<T = any>(
    url: string,
    queryParams?: Record<string, string | number | boolean>,
    options?: Partial<RequestOptions>
  ): Promise<ApiResponse<T>> {
    return this.addToQueue<T>(url, {
      method: "DELETE",
      queryParams,
      ...options,
    });
  }

  // Utility methods
  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing.size,
      maxCapacity: this.maxCapacity,
      isFull: this.queue.length >= this.maxCapacity,
    };
  }

  clearQueue() {
    this.queue.forEach((item) => {
      item.reject(new Error("Queue cleared"));
    });
    this.queue = [];
  }

  /**
   * Clear URL cache
   */
  clearCache() {
    this.urlCache.clear();
  }

  /**
   * Get detailed status including cache
   */
  getDetailedStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing.size,
      maxCapacity: this.maxCapacity,
      isFull: this.queue.length >= this.maxCapacity,
      cacheSize: this.urlCache.size,
    };
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

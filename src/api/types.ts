// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  httpCode: number;
}

// Request Configuration
export interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Queue Configuration
export interface QueueConfig {
  maxCapacity: number;
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
}

// Queue Item
export interface QueueItem {
  id: string;
  url: string;
  config: RequestConfig;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  retries: number;
  createdAt: number;
}

// API Endpoints
export interface ApiEndpoints {
  // Auth
  auth: {
    login: string;
    logout: string;
    me: string;
    refresh: string;
  };
  // Dashboard
  dashboard: {
    getStats: string;
    getTodayStaff: string;
    getTodayTickets: string;
  };
  // Tickets
  tickets: {
    list: string;
    create: string;
    update: string;
    delete: string;
    getById: string;
  };
  // Customers
  customers: {
    list: string;
    create: string;
    update: string;
    delete: string;
    getById: string;
  };
  // Performance
  performance: {
    getMetrics: string;
    getReports: string;
  };
  // Reports
  reports: {
    generate: string;
    download: string;
    list: string;
  };
  // Settings
  settings: {
    get: string;
    update: string;
  };
}

// Entity Types
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  customerId: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  totalCustomers: number;
  activeStaff: number;
  todayTickets: number;
}

// Auth Types
export interface PermissionDTO {
  id: number;
  name: string;
  description?: string;
}

export interface UserGroupDTO {
  groupId: number;
  name: string;
  code: string;
  description?: string;
}

export interface AuthenticatedUserInfo {
  username: string;
  name: string;
  description?: string;
  userGroup: UserGroupDTO;
  permissions: PermissionDTO[];
}

export interface ErrorResponse {
  serverTime: string;
  path: number;
  code: number;
  message: string;
  details?: any;
}

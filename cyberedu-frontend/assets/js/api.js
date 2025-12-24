// ================================
// Global API service (Production)
// ================================
class ApiService {
  constructor() {
    this.baseURL = "https://cybereduv1-production.up.railway.app/api/v1";

    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");

    this.isRefreshing = false;
    this.failedQueue = [];
    this.cache = {};
    this.cacheTimers = {};
  }

  // ================================
  // Core request handler
  // ================================
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && !options._retry) {
      return this.handleUnauthorized(endpoint, options);
    }

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return response.status === 204 ? null : await response.json();
  }

  // ================================
  // Handle 401 → refresh token
  // ================================
  async handleUnauthorized(endpoint, options) {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject, endpoint, options });
      });
    }

    this.isRefreshing = true;

    try {
      const tokens = await this.refreshAccessToken();

      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;

      localStorage.setItem("accessToken", this.accessToken);
      localStorage.setItem("refreshToken", this.refreshToken);

      this.clearCache();
      this.processQueue();

      return this.request(endpoint, { ...options, _retry: true });
    } catch {
      this.clearTokens();
      if (window.showPage) window.showPage("landing-page");
      throw new Error("Session expired. Please login again.");
    } finally {
      this.isRefreshing = false;
    }
  }

  // ================================
  // Refresh token (SECURE)
  // ================================
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error("No refresh token");
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Refresh token invalid");
    }

    const data = await response.json();
    return data.data || data.tokens || data;
  }

  processQueue() {
    this.failedQueue.forEach(({ resolve, reject, endpoint, options }) => {
      this.request(endpoint, options).then(resolve).catch(reject);
    });
    this.failedQueue = [];
  }

  // ================================
  // Error handler
  // ================================
  async handleError(response) {
    let message = `HTTP ${response.status}`;

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {}

    return new Error(message);
  }

  // ================================
  // Token helpers
  // ================================
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.clearCache();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  clearCache() {
    Object.values(this.cacheTimers).forEach(clearTimeout);
    this.cache = {};
    this.cacheTimers = {};
  }

  // ================================
  // HTTP helpers + caching
  // ================================
  get(endpoint) {
    if (this.cache[endpoint]) {
      return Promise.resolve(this.cache[endpoint]);
    }

    return this.request(endpoint, { method: "GET" }).then((data) => {
      this.cache[endpoint] = data;
      this.cacheTimers[endpoint] = setTimeout(() => {
        delete this.cache[endpoint];
      }, 3000);
      return data;
    });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // ================================
  // File upload
  // ================================
  async uploadFile(endpoint, formData) {
    const headers = {};
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (response.status === 401) {
      await this.refreshAccessToken();
      return this.uploadFile(endpoint, formData);
    }

    if (!response.ok) {
      throw await this.handleError(response);
    }

    return response.json();
  }
}

// ================================
// Singleton
// ================================
const api = new ApiService();
export default api;

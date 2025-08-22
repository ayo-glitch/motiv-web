import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/lib/types/api";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: "https://motiv-app-yenh2.ondigitalocean.app/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();
  }

  private setupInterceptors() {
    // Request interceptor - attach token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: "An unexpected error occurred",
          code: "UNKNOWN_ERROR",
        };

        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;

          if (status === 401) {
            // Unauthorized - clear token
            this.clearToken();
            apiError.message = "Authentication required";
            apiError.code = "UNAUTHORIZED";
          } else if (status === 403) {
            apiError.message = "Access forbidden";
            apiError.code = "FORBIDDEN";
          } else if (status === 404) {
            apiError.message = "Resource not found";
            apiError.code = "NOT_FOUND";
          } else if (status >= 500) {
            apiError.message = "Server error. Please try again later.";
            apiError.code = "SERVER_ERROR";
          } else {
            // Use server error message if available
            apiError.message =
              (data as any)?.message || `Request failed with status ${status}`;
            apiError.code = (data as any)?.code || "REQUEST_FAILED";
          }

          apiError.details = data;
        } else if (error.request) {
          // Network error
          apiError.message = "Network error. Please check your connection.";
          apiError.code = "NETWORK_ERROR";
        }

        return Promise.reject(apiError);
      }
    );
  }

  private loadTokenFromStorage() {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("motiv_user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          this.token = userData.token;
        } catch (error) {
          console.error("Error parsing saved user data:", error);
          localStorage.removeItem("motiv_user");
        }
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("motiv_user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          userData.token = token;
          localStorage.setItem("motiv_user", JSON.stringify(userData));
        } catch (error) {
          console.error("Error updating token in storage:", error);
        }
      }
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("motiv_user");
    }
  }

  // HTTP methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch(url, data);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

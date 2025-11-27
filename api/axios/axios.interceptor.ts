import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // send HttpOnly cookies
});

// -----------------------------------------------------
// REQUEST INTERCEPTOR — attach access token
// -----------------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------------------------------
// RESPONSE INTERCEPTOR — auto-refresh logic
// -----------------------------------------------------

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // queue failed requests until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint (cookie sent automatically)
        const refreshResponse = await api.post<{ accessToken: string }>(
          "/auth/refresh",
          {},
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Retry all queued requests
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] =
            `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear access token + redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If not a refresh case, reject normally
    return Promise.reject(error);
  }
);

export default api;

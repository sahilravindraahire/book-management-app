import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isExemptFromRetry =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/me"); // ✅ don't try to "refresh" a routine auth check

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isExemptFromRetry
    ) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await api.post("/auth/refresh-token");
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/login" // ✅ never redirect-loop from the login page itself
          ) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
//   withCredentials: true,
// });

// export default api;

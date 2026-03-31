import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
  },
});

// 🔥 request interceptor (inject token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 response interceptor (IMPORTANT)
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // 🔥 token invalide → cleanup
      localStorage.removeItem("token");

      // redirect login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
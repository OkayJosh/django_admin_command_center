import axios from "axios";

const getCookie = (name: string) => {
  if (typeof document === "undefined") {
    return null;
  }
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1] ?? null;
};

const api = axios.create({
  baseURL: "/api/command-center/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getCookie("csrftoken");
  if (token) {
    config.headers = {
      ...config.headers,
      "X-CSRFToken": token,
    };
  }
  return config;
});

export default api;

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Try to get token from localStorage first (as per authService update)
  // Our authService saves the full user object in localStorage, which contains the token
  const userStr = localStorage.getItem("user");
  let token = null;

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      token = user.token;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }

  // If not in localStorage user object, try getting from cookie directly if js-cookie was imported here (it's not)
  // But authService ensures token is in localStorage user object.

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

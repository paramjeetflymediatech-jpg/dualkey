import api from "./api";
import Cookies from "js-cookie";

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
    Cookies.set("token", response.data.token, { expires: 7 });
  }
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post("/auth/login", userData);

  // Handle nested data structure if present
  const data = response.data.data || response.data;

  if (data.token) {
    localStorage.setItem("user", JSON.stringify(data));
    Cookies.set("token", data.token, { expires: 7 });
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem("user");
  Cookies.remove("token");
};

export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("user"));
  }
  return null;
};

// User Management (Admin)
export const getAllUsers = async (page = 1, limit = 10) => {
  const response = await api.get(`/users?page=${page}&limit=${limit}`);
  const data = response.data.data || response.data;
  data.users = data.users.map((user) => {
    if (!user._id) {
      user._id = user?.id;
    }
    return user;
  });
  return data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  const data = response.data.data || response.data;
  return data;
};

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  const data = response.data.data || response.data;
  return data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  const data = response.data.data || response.data;
  return data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  const data = response.data.data || response.data;
  return data;
};

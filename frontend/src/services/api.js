// src/services/api.js
// import axios from "axios";
import { API_URL } from "./config";

// Auth APIs
// export const login = (credentials) => axios.post(`${API_URL}/auth/login`, credentials);

// Product APIs
export const fetchProducts =fetch(`${API_URL}/products`);
// export const createProduct = (data) => axios.post(`${API_URL}/products`, data);
// export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data);
// export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);

// Other endpoints follow similarly...

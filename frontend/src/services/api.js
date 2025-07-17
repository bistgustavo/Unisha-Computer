import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v2/",
  timeout: 10000,
  withCredentials: true,
  credentials: "include",
});

export default api;

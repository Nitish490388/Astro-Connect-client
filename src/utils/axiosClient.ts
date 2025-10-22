import axios from "axios";
axios.defaults.withCredentials = true;

const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosClient;

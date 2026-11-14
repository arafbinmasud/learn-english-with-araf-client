import axios from "axios";
import { auth } from "../firebase/firebase.config";

export const axiosSecure = axios.create({
  baseURL: "https://learn-english-with-araf-server.onrender.com",
  withCredentials: true,
});

axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401 || status === 403) {
      await auth.signOut();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);

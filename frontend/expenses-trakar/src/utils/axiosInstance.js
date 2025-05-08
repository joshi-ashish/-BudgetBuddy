import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Ensure BASE_URL is correctly set
    timeout: 10000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// 🔹 Request Interceptor: Adds Authorization Header
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔹 Response Interceptor: Handles Errors Globally
axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful response directly
    (error) => {
        if (error.response) {
            const { status } = error.response;

            // 🔸 Handle Unauthorized (401)
            if (status === 401) {
                console.warn("Unauthorized! Redirecting to login...");
                localStorage.removeItem("token"); // Clear stored token
                window.location.href = "/login";
            }

            // 🔸 Handle Server Errors (500)
            else if (status === 500) {
                console.error("Server error. Please try again later.");
            }
        }

        // 🔸 Handle Timeout or Network Issues
        else if (error.code === "ECONNABORTED") {
            console.error("Request timeout! Please try again.");
        }

        return Promise.reject(error.response || error);
    }
);

export default axiosInstance;

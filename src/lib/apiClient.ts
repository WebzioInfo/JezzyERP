import axios from "axios";

/**
 * Standard API Client with Axios
 * This ensures consistency across the app, 
 * including authorization headers if needed.
 */
const apiClient = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Response Interceptor for handling errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || error.message || "An unexpected error occurred.";
        console.error("[API_ERROR]", message);
        return Promise.reject(error);
    }
);

export default apiClient;

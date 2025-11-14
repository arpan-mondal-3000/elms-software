import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

function onRefreshed() {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb: () => void) {
    refreshSubscribers.push(cb);
}

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await api.post("/refresh"); // refresh accessToken with refreshToken
                    isRefreshing = false;
                    onRefreshed();
                } catch (err) {
                    isRefreshing = false;
                    useAuthStore.getState().logout(); // redirect to login of refresh fails
                    window.location.href = "/login";
                    return Promise.reject(err);
                }
            }

            return new Promise((resolve) => {
                addRefreshSubscriber(() => resolve(api(originalRequest)));
            });
        }

        return Promise.reject(error);
    }
);

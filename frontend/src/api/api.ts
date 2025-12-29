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
                    console.log("Trying to refresh access token...")
                    await fetch("/auth/refresh", { method: "GET", credentials: "include" }); // refresh accessToken with refreshToken
                    isRefreshing = false;
                    onRefreshed();
                } catch (err) {
                    console.log(err);
                    isRefreshing = false;
                    useAuthStore.getState().user = null;
                    window.location.href = "/login"; // redirect to login if refresh fails
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

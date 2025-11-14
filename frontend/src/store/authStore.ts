// Library import
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../api/api";

// Types import
import { type User, type EmployeeData } from "../lib/types";

type AuthState = {
    user: User;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (empData: EmployeeData) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
};

export const useAuthStore = create(
    persist<AuthState>(
        (set) => ({
            user: null,
            loading: false,

            login: async (email, password) => {
                await set({ loading: true });
                try {
                    const res = await api.post("/auth/login", { email, password }); // backend sets cookies and sends user data
                    set({ user: res.data.user });
                    return res.data.user;
                } finally {
                    set({ loading: false });
                }
            },

            register: async (empData: EmployeeData) => {
                set({ loading: true });
                try {
                    await api.post("/auth/register", { ...empData });
                } finally {
                    set({ loading: false });
                }
            },

            logout: async () => {
                try {
                    await api.post("/auth/logout");
                } finally {
                    set({ user: null });
                }
            },

            fetchUser: async () => {
                set({ loading: true });
                try {
                    const res = await api.get("/user/profile");
                    set({ user: res.data.user });
                } catch {
                    set({ user: null });
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "auth-storage", // localStorage key
            partialize: (state) => ({ user: state.user } as AuthState), // only persist user
        }
    )
);

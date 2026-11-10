import type { UserPresence } from "@/types/presence";
import { create } from "zustand";

interface PresenceState {
    presences: Record<string, UserPresence>;

    setPresence: (userId: string, presence: UserPresence) => void;

    setPresences: (
        users: {
            _id: string;
            isOnline: boolean;
            lastOnline: string | null;
        }[],
    ) => void;

    setUserOnline: (userId: string) => void;

    setUserOffline: (userId: string, lastOnline: string) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
    presences: {},

    // Cập nhật một người dùng
    setPresence: (userId, presence) =>
        set((state) => ({
            presences: {
                ...state.presences,
                [userId]: presence,
            },
        })),

    // Đồng bộ danh sách người dùng từ API
    setPresences: (users) =>
        set((state) => {
            const updated = { ...state.presences };

            users.forEach((user) => {
                updated[user._id] = {
                    isOnline: user.isOnline,
                    lastOnline: user.lastOnline,
                };
            });

            return { presences: updated };
        }),

    // Người dùng vừa Online
    setUserOnline: (userId) =>
        set((state) => ({
            presences: {
                ...state.presences,
                [userId]: {
                    isOnline: true,
                    lastOnline: state.presences[userId]?.lastOnline ?? null,
                },
            },
        })),

    // Người dùng vừa Offline
    setUserOffline: (userId, lastOnline) =>
        set((state) => ({
            presences: {
                ...state.presences,
                [userId]: {
                    isOnline: false,
                    lastOnline,
                },
            },
        })),
}));

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
    removePresence: (userId: string) => void;
    clearPresences: () => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
    presences: {},

    setPresence: (userId, presence) =>
        set((state) => ({
            presences: {
                ...state.presences,
                [userId]: presence,
            },
        })),

    setPresences: (users) =>
        set((state) => {
            const next = { ...state.presences };

            for (const user of users) {
                if (user.isOnline === null) {
                    delete next[user._id];
                    continue;
                }

                next[user._id] = {
                    isOnline: user.isOnline,
                    lastOnline: user.lastOnline,
                };
            }

            return { presences: next };
        }),

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

    removePresence: (userId) =>
        set((state) => {
            const next = { ...state.presences };

            delete next[userId];

            return { presences: next };
        }),

    clearPresences: () => set({ presences: {} }),
}));

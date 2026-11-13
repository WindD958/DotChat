import { create } from "zustand";

import type { UserSettings } from "@/types/user";
import { settingsService } from "@/services/settingsService";

interface SettingsState {
    settings: UserSettings | null;
    isLoading: boolean;

    fetchSettings: () => Promise<void>;

    updatePrivacy: (updates: Partial<UserSettings["privacy"]>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    settings: null,
    isLoading: false,

    fetchSettings: async () => {
        try {
            set({ isLoading: true });

            const settings = await settingsService.getSettings();

            set({ settings });
        } finally {
            set({ isLoading: false });
        }
    },

    updatePrivacy: async (updates) => {
        const currentSettings = get().settings;

        if (!currentSettings) return;

        const previousSettings = currentSettings;

        // Cập nhật giao diện trước để tránh cảm giác chậm
        set({
            settings: {
                ...currentSettings,
                privacy: {
                    ...currentSettings.privacy,
                    ...updates,
                },
            },
        });

        try {
            const settings = await settingsService.updateSettings({
                privacy: updates,
            });

            set({ settings });
        } catch (error) {
            // Khôi phục nếu backend cập nhật thất bại
            set({ settings: previousSettings });

            throw error;
        }
    },
}));

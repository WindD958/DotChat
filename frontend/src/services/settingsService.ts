import api from "@/lib/axios";
import type { UserSettings } from "@/types/user";

export const settingsService = {
    async getSettings(): Promise<UserSettings> {
        const res = await api.get("/users/settings");

        return res.data.settings;
    },

    async updateSettings(
        updates: Partial<UserSettings>,
    ): Promise<UserSettings> {
        const res = await api.patch("/users/settings", updates);

        return res.data.settings;
    },
};

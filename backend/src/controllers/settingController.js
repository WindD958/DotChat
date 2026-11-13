import User from "../models/User.js";
import {
    getUserSettings,
    updateUserSettings,
} from "../services/settingService.js";
import { refreshPresenceForUser } from "../socket/index.js";

export const getSettings = async (req, res) => {
    try {
        const settings = await getUserSettings(req.user._id);

        return res.status(200).json({
            success: true,
            settings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const oldUser = await User.findById(req.user._id)
            .select("settings.privacy.hideActivityStatus")
            .lean();

        const settings = await updateUserSettings(req.user._id, req.body);

        const oldValue =
            oldUser?.settings?.privacy?.hideActivityStatus ?? false;

        const newValue = settings?.privacy?.hideActivityStatus ?? false;

        if (oldValue !== newValue) {
            await refreshPresenceForUser(req.user._id.toString());
        }

        return res.status(200).json({
            success: true,
            settings,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

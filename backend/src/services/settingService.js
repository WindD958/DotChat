import User from "../models/User.js";

export const getUserSettings = async (userId) => {
    const user = await User.findById(userId).select("settings");

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    return user.settings;
};

export const updateUserSettings = async (userId, updates) => {
    const allowedFields = {
        "privacy.hideActivityStatus": updates.privacy?.hideActivityStatus,

        "notifications.messageNotifications":
            updates.notifications?.messageNotifications,

        "notifications.soundEnabled": updates.notifications?.soundEnabled,

        "chat.enterToSend": updates.chat?.enterToSend,

        "chat.messagePreview": updates.chat?.messagePreview,

        "appearance.theme": updates.appearance?.theme,
    };

    const updateData = {};

    for (const [key, value] of Object.entries(allowedFields)) {
        if (value !== undefined) {
            updateData[`settings.${key}`] = value;
        }
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error("Không có cài đặt hợp lệ để cập nhật");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        {
            returnDocument: "after",
            runValidators: true,
        },
    ).select("settings");

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    return user.settings;
};

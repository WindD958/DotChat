import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
    {
        privacy: {
            hideActivityStatus: {
                type: Boolean,
                default: false,
            },
        },

        notifications: {
            messageNotifications: {
                type: Boolean,
                default: true,
            },
        },

        chat: {
            enterToSend: {
                type: Boolean,
                default: true,
            },

            messagePreview: {
                type: Boolean,
                default: true,
            },
        },

        appearance: {
            theme: {
                type: String,
                enum: ["light", "dark", "system"],
                default: "system",
            },
        },
    },
    {
        _id: false,
    },
);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        displayName: {
            type: String,
            required: true,
            trim: true,
        },
        avatarUrl: {
            type: String,
        },
        avatarId: {
            type: String,
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        phone: {
            type: String,
            sparse: true,
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        lastOnline: {
            type: Date,
            default: null,
        },
        settings: {
            type: userSettingsSchema,
            default: () => ({}),
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model("User", userSchema);
export default User;

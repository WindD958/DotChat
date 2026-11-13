export interface User {
    _id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
    isOnline?: boolean;
    lastOnline?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserSettings {
    privacy: {
        hideActivityStatus?: boolean;
    };

    notifications: {
        messageNotifications: boolean;
        soundEnabled: boolean;
    };

    chat: {
        enterToSend: boolean;
        messagePreview: boolean;
    };

    appearance: {
        theme: "light" | "dark" | "system";
    };
}

export interface Friend {
    _id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    isOnline: boolean | null;
    lastOnline?: string | null;
}

export interface FriendRequest {
    _id: string;
    from?: {
        _id: string;
        username: string;
        displayName: string;
        avatarUrl?: string;
    };
    to?: {
        _id: string;
        username: string;
        displayName: string;
        avatarUrl?: string;
    };
    message: string;
    createdAt: string;
    updatedAt: string;
}

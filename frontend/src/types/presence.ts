export interface UserPresence {
    isOnline: boolean;
    lastOnline: string | null;
}

export interface UserOfflinePayload {
    userId: string;
    lastOnline: string;
}

export interface UserOnlinePayload {
    userId: string;
}

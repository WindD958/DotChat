export interface UserPresence {
    isOnline: boolean;
    lastOnline: string | null;
}

export interface PresenceItem extends UserPresence {
    userId: string;
}

export interface UserOfflinePayload {
    userId: string;
    lastOnline: string;
}

export interface UserOnlinePayload {
    userId: string;
}

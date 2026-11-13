import { usePresenceStore } from "@/stores/usePresenceStore";

interface UserStatusProps {
    userId?: string;
}

const StatusBadge = ({ userId }: UserStatusProps) => {
    const presence = usePresenceStore((state) =>
        userId ? state.presences[userId] : undefined,
    );

    if (!userId || !presence) return null;

    if (presence.isOnline) {
        return (
            <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-card status-online"></div>
        );
    }

    return (
        <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-card status-offline"></div>
    );
};

export default StatusBadge;

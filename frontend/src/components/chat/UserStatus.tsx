import { formatOfflineTime } from "@/lib/utils";
import { usePresenceStore } from "@/stores/usePresenceStore";

interface UserStatusProps {
    userId?: string;
    now: number;
}

const UserStatus = ({ userId, now }: UserStatusProps) => {
    const presence = usePresenceStore((state) =>
        userId ? state.presences[userId] : undefined,
    );

    if (!userId || !presence) return null;

    if (presence.isOnline) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-green-500">Đang hoạt động</span>
            </div>
        );
    }

    return (
        <span className="text-sm text-gray-500">
            {formatOfflineTime(presence.lastOnline, now)}
        </span>
    );
};

export default UserStatus;

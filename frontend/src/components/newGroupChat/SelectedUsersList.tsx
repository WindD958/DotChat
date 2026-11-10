import type { Friend } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";
import { X } from "lucide-react";

interface SelectedUsersList {
    invitedUsers: Friend[];
    onRemove: (user: Friend) => void;
}

const SelectedUsersList = ({ invitedUsers, onRemove }: SelectedUsersList) => {
    if (invitedUsers.length === 0) {
        return;
    }

    return (
        <div className="flex flex-wrap gap-2 pt-2">
            {invitedUsers.map((user) => (
                <div
                    key={user._id}
                    className="w-full flex items-center justify-between gap-2 bg-muted text-sm rounded-md p-2"
                >
                    <UserAvatar
                        type="mess"
                        name={user.displayName}
                        avatarUrl={user.avatarUrl}
                    />
                    <span className="flex-1">{user.displayName}</span>
                    <X
                        className="size-4 cursor-pointer hover:text-destructive"
                        onClick={() => onRemove(user)}
                    />
                </div>
            ))}
        </div>
    );
};

export default SelectedUsersList;

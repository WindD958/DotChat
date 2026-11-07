import type { Friend } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";

interface InviteSuggestionList {
    filterFriends: Friend[];
    onSelect: (friend: Friend) => void;
}

const InviteSuggestionList = ({
    filterFriends,
    onSelect,
}: InviteSuggestionList) => {
    if (filterFriends.length === 0) {
        return;
    }

    return (
        <div className="border rounded-lg mt-2 max-h-[180px] overflow-y-auto divide-y">
            {filterFriends.map((friend) => (
                <div
                    onClick={() => onSelect(friend)}
                    key={friend._id}
                    className="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted"
                >
                    <UserAvatar
                        type="chat"
                        name={friend.displayName}
                        avatarUrl={friend.avatarUrl}
                    />

                    <span className="font-medium">{friend.displayName}</span>
                </div>
            ))}
        </div>
    );
};

export default InviteSuggestionList;

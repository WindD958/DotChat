import type { Friend } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";
import { useChatStore } from "@/stores/useChatStore";

interface InviteSuggestionList {
    filterFriends: Friend[];
    onSelect: () => void;
}

const SearchFriendList = ({
    filterFriends,
    onSelect,
}: InviteSuggestionList) => {
    const { createConversation, fetchMessages } = useChatStore();

    const handleAddConversation = async (friendId: string) => {
        await createConversation("direct", "", [friendId]);
        await fetchMessages();
    };

    if (filterFriends.length === 0) {
        return;
    }

    return (
        <div className="border rounded-md overflow-y-auto divide-y shadow-md absolute bg-muted z-10 top-11.5 w-[calc(100%-68px)]">
            {filterFriends.map((friend) => (
                <div
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                        handleAddConversation(friend._id);
                        onSelect();
                    }}
                    key={friend._id}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
                >
                    <UserAvatar
                        type="mess"
                        name={friend.displayName}
                        avatarUrl={friend.avatarUrl}
                    />

                    <span className="font-medium">{friend.displayName}</span>
                    <span className="italic opacity-50">
                        @{friend.username}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default SearchFriendList;

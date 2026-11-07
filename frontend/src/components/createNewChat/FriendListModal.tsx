import { useFriendStore } from "@/stores/useFriendStore";
import { Card } from "../ui/card";
import UserAvatar from "../chat/UserAvatar";
import { useChatStore } from "@/stores/useChatStore";

const FriendListModal = () => {
    const { friends } = useFriendStore();
    const { createConversation, fetchMessages } = useChatStore();

    const handleAddConversation = async (friendId: string) => {
        await createConversation("direct", "", [friendId]);
        await fetchMessages();
    };

    return (
        <div className="max-w-md">
            <h1 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                danh sách bạn bè
            </h1>

            <div className="space-y-2 max-h-60 overflow-y-auto">
                {friends.map((friend) => (
                    <Card
                        key={friend._id}
                        onClick={() => handleAddConversation(friend._id)}
                        className="p-3 ring-0 border cursor-pointer transition-smooth hover:shadow-soft hover:bg-muted group/friendCard"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <UserAvatar
                                    type="sidebar"
                                    name={friend.displayName}
                                    avatarUrl={friend.avatarUrl}
                                />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col">
                                <h2 className="font-semibold text-sm truncate">
                                    {friend.displayName}
                                </h2>
                                <span className="text-sm text-muted-foreground ">
                                    @{friend.username}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}

                {friends.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        Chưa có bạn bè, kết bạn để bắt đầu trò chuyện.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendListModal;

import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import ChatCard from "./ChatCard";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import GroupChatAvatar from "./GroupChatAvatar";

const MessageCard = ({ convo }: { convo: Conversation }) => {
    const { user } = useAuthStore();
    const {
        activeConversationId,
        setActiveConversation,
        messages,
        fetchMessages,
    } = useChatStore();

    if (!user) return null;

    const otherUser = convo.participants.find((p) => p.userId !== user._id);
    if (!otherUser) return null;

    const unreadCount = convo.unreadCounts[user._id];
    const lastMessage = convo.lastMessage?.content ?? "";
    const nameGroup = convo.group?.name ?? null;

    const handleSelectConversation = async (id: string) => {
        sessionStorage.clear();
        setActiveConversation(id);
        if (id === activeConversationId) {
            setActiveConversation(null);
        }
        if (!messages[id]) {
            await fetchMessages();
        }
    };

    return (
        <ChatCard
            convoId={convo._id}
            name={nameGroup ?? otherUser.displayName}
            timestamp={
                convo.lastMessage?.createdAt
                    ? new Date(convo.lastMessage.createdAt)
                    : undefined
            }
            isActive={activeConversationId === convo._id}
            onSelect={handleSelectConversation}
            unreadCount={unreadCount}
            leftSection={
                <>
                    {convo.type === "direct" ? (
                        <>
                            <UserAvatar
                                type="sidebar"
                                name={otherUser.displayName ?? ""}
                                avatarUrl={otherUser.avatarUrl ?? undefined}
                            />
                            <StatusBadge userId={otherUser?.userId} />
                        </>
                    ) : (
                        <GroupChatAvatar
                            participants={convo.participants}
                            type="mess"
                        />
                    )}
                    {unreadCount > 0 && (
                        <UnreadCountBadge unreadCount={unreadCount} />
                    )}
                </>
            }
            subtitle={
                <p
                    className={cn(
                        "text-sm truncate",
                        unreadCount > 0
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                    )}
                >
                    {lastMessage}
                </p>
            }
        />
    );
};

export default MessageCard;

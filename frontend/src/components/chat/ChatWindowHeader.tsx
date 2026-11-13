import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { Separator } from "../ui/separator";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import UserStatus from "./UserStatus";
import { useCurrentTime } from "@/hooks/useCurrentTime";
interface Props {
    chat: Conversation;
    onToggle: () => void;
}

const ChatWindowHeader = ({ chat, onToggle }: Props) => {
    const { conversations, activeConversationId } = useChatStore();
    const { user } = useAuthStore();
    const now = useCurrentTime();
    let otherUser;

    chat = chat ?? conversations.find((c) => c._id === activeConversationId);

    if (!chat) {
        return (
            <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
                <SidebarTrigger
                    size="icon-lg"
                    className="cursor-pointer ml-1 text-foreground"
                />
            </header>
        );
    }

    if (chat.type === "direct") {
        const otherUsers = chat.participants.filter(
            (p) => p.userId !== user?._id,
        );
        otherUser = otherUsers.length > 0 ? otherUsers[0] : null;
        if (!user || !otherUser) return;
    }

    return (
        <header className="sticky top-0 z-10 px-4 flex items-center bg-background">
            <div className="flex items-center gap-2 w-full">
                <SidebarTrigger
                    size="icon-lg"
                    className="cursor-pointer ml-1 text-foreground"
                />
                <Separator
                    orientation="vertical"
                    className="mr-2 w-0.5 data-[orientation=vertical]:h-4"
                />

                <div className="p-2 w-full flex items-center gap-3 ">
                    <div className="relative">
                        {chat.type === "direct" ? (
                            <>
                                <UserAvatar
                                    type={"chat"}
                                    name={otherUser?.displayName || "DotChat"}
                                    avatarUrl={
                                        otherUser?.avatarUrl || undefined
                                    }
                                />
                                <StatusBadge userId={otherUser?.userId} />
                            </>
                        ) : (
                            <GroupChatAvatar
                                participants={chat.participants}
                                type="chat"
                            />
                        )}
                    </div>

                    <div>
                        <h2 className="font-semibold text-foreground">
                            {chat.type === "direct"
                                ? otherUser?.displayName
                                : chat.group?.name}
                        </h2>
                        {chat.type === "group" ? (
                            <p className="text-sm truncate text-muted-foreground">
                                {chat.participants.length} thành viên
                            </p>
                        ) : (
                            <UserStatus userId={otherUser?.userId} now={now} />
                        )}
                    </div>
                </div>
            </div>

            <Button
                onClick={onToggle}
                size="icon-lg"
                variant="ghost"
                className="cursor-pointer"
            >
                <Menu className="size-4" />
            </Button>
        </header>
    );
};

export default ChatWindowHeader;

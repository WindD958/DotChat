import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Badge } from "../ui/badge";

interface MessageItemProps {
    message: Message;
    index: number;
    messages: Message[];
    selectedConvo: Conversation;
    lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
    message,
    index,
    messages,
    selectedConvo,
    lastMessageStatus,
}: MessageItemProps) => {
    const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

    const isShowTime =
        index === 0 ||
        new Date(message.createdAt).getTime() -
            new Date(prev?.createdAt || 0).getTime() >
            300000;

    const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

    const participant = selectedConvo.participants.find(
        (p: Participant) => p.userId === message.senderId,
    );

    return (
        <>
            <div
                className={cn(
                    "flex gap-3 message-bounce mt-1",
                    message.isOwn ? "justify-end" : "justify-start",
                )}
            >
                {/* Avatar */}
                {!message.isOwn && (
                    <div className="w-8">
                        <UserAvatar
                            type="mess"
                            name={participant?.displayName ?? "DotChat"}
                            avatarUrl={participant?.avatarUrl ?? undefined}
                        />
                    </div>
                )}

                {/* Message */}
                <div
                    className={cn(
                        "max-w-xs lg:max-w-md space-y-1 flex-col",
                        message.isOwn ? "items-end" : "items-start",
                    )}
                >
                    <div
                        className={cn(
                            "py-1.5 px-3 rounded-sm",
                            message.isOwn
                                ? "nd-chat-bubble-sent"
                                : "nd-chat-bubble-received",
                        )}
                    >
                        <p className="text-sm leading-relaxed wrap-break-word">
                            {message.content}
                        </p>
                    </div>

                    {/* Seen | Delivered */}
                    {message.isOwn &&
                        message._id === selectedConvo.lastMessage?._id && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-xs px-1.5 py-0.5 h-4 border-0",
                                    lastMessageStatus === "seen"
                                        ? "bg-primary/20 text-primary"
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                {lastMessageStatus === "seen"
                                    ? "Đã xem"
                                    : "Đã gửi"}
                            </Badge>
                        )}
                </div>

                {message.isOwn && (
                    <div className="w-8">
                        <UserAvatar
                            type="mess"
                            name={participant?.displayName ?? "DotChat"}
                            avatarUrl={participant?.avatarUrl ?? undefined}
                        />
                    </div>
                )}
            </div>
            {/* Time */}
            {isShowTime && (
                <span className="flex text-xs text-muted-foreground px-1 justify-center">
                    {formatMessageTime(new Date(message.createdAt))}
                </span>
            )}
        </>
    );
};

export default MessageItem;

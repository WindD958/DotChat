import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { CheckCheck } from "lucide-react";
import SeenByAvatar from "./SeenByAvatar";

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

    const participant = selectedConvo.participants.find(
        (p: Participant) => p.userId === message.senderId,
    );

    return (
        <div className="mt-2">
            {/* Time */}
            {isShowTime && (
                <span className="flex text-xs text-muted-foreground px-1 justify-center">
                    {formatMessageTime(new Date(message.createdAt))}
                </span>
            )}

            <div
                className={cn(
                    "flex gap-2.5 message-bounce",
                    message.isOwn ? "justify-end" : "justify-start",
                )}
            >
                {/* Other Avatar */}
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
                </div>

                {/* User Avatar */}
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

            {/* Seen | Delivered */}
            {message.isOwn &&
                message._id === selectedConvo.lastMessage?._id && (
                    <div className="flex justify-end items-center mt-1 mr-9 text-xs px-1.5 py-0.5 h-4 border-0 text-primary">
                        {lastMessageStatus === "seen" ? (
                            <>
                                <SeenByAvatar
                                    type="seenStatus"
                                    seenByList={selectedConvo.seenBy}
                                />
                            </>
                        ) : (
                            <>
                                <CheckCheck className="size-3.5 mr-1" />
                                <span className="font-medium">Đã gửi</span>
                            </>
                        )}
                    </div>
                )}
        </div>
    );
};

export default MessageItem;

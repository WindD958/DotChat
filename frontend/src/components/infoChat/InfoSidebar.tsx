import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import type { Conversation } from "@/types/chat";
import {
    X,
    Search,
    BellOff,
    Pin,
    Image,
    FileText,
    Link,
    ChevronRight,
    Palette,
    Smile,
    Clock,
    Shield,
    Ban,
    Trash2,
    Users,
    MoreHorizontal,
} from "lucide-react";
import UserAvatar from "../chat/UserAvatar";
import StatusBadge from "../chat/StatusBadge";
import GroupChatAvatar from "../chat/GroupChatAvatar";
import UserStatus from "../chat/UserStatus";
import { Button } from "../ui/button";

interface InfoSidebarProps {
    onToggle: () => void;
    convo: Conversation;
}

const InfoSidebar = ({ onToggle, convo }: InfoSidebarProps) => {
    const menuGroups = [
        {
            title: "Tệp phương tiện",
            items: [
                { icon: Image, label: "Ảnh và video" },
                { icon: FileText, label: "Tệp đã chia sẻ" },
                { icon: Link, label: "Liên kết đã chia sẻ" },
            ],
        },
        {
            title: "Tùy chỉnh",
            items: [
                { icon: Palette, label: "Thay đổi chủ đề" },
                { icon: Smile, label: "Biểu tượng cảm xúc" },
                { icon: Pin, label: "Tin nhắn đã ghim" },
            ],
        },
        {
            title: "Quyền riêng tư",
            items: [
                { icon: Clock, label: "Tin nhắn tự biến mất" },
                { icon: Shield, label: "Quyền riêng tư và bảo mật" },
            ],
        },
        {
            title: "Quản lý",
            items: [
                { icon: Users, label: "Thành viên" },
                { icon: Ban, label: "Chặn người dùng", danger: true },
                { icon: Trash2, label: "Xóa cuộc trò chuyện", danger: true },
            ],
        },
    ];

    const { conversations, activeConversationId } = useChatStore();
    const { user } = useAuthStore();
    const now = useCurrentTime();
    let otherUser;

    convo = convo ?? conversations.find((c) => c._id === activeConversationId);

    if (convo.type === "direct") {
        const otherUsers = convo.participants.filter(
            (p) => p.userId !== user?._id,
        );
        otherUser = otherUsers.length > 0 ? otherUsers[0] : null;
        if (!user || !otherUser) return;
    }

    return (
        <aside className="flex h-full w-[320px] flex-col border-l border-gray-200 bg-white">
            {/* Header */}
            <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-gray-100 px-5">
                <h2 className="text-[15px] font-semibold text-gray-800">
                    Thông tin hội thoại
                </h2>

                <Button
                    onClick={onToggle}
                    variant="ghost"
                    size="icon-lg"
                    className="cursor-pointer"
                >
                    <X className="size-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Profile */}
                <div className="flex flex-col items-center px-5 pb-6 pt-7">
                    <div className="relative">
                        {convo.type === "direct" ? (
                            <>
                                <UserAvatar
                                    type={"profile"}
                                    name={otherUser?.displayName || "DotChat"}
                                    avatarUrl={
                                        otherUser?.avatarUrl || undefined
                                    }
                                />
                                <StatusBadge userId={otherUser?.userId} />
                            </>
                        ) : (
                            <GroupChatAvatar
                                participants={convo.participants}
                                type="chat"
                            />
                        )}
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-gray-900">
                        {convo.type === "direct"
                            ? otherUser?.displayName
                            : convo.group?.name}
                    </h3>

                    {convo.type === "group" ? (
                        <p className="text-sm truncate text-muted-foreground">
                            {convo.participants.length} thành viên
                        </p>
                    ) : (
                        <UserStatus userId={otherUser?.userId} now={now} />
                    )}

                    {/* Quick actions */}
                    <div className="mt-6 flex w-full justify-center gap-8">
                        {[
                            { icon: Search, label: "Tìm kiếm" },
                            { icon: BellOff, label: "Tắt thông báo" },
                            { icon: Pin, label: "Ghim" },
                            { icon: MoreHorizontal, label: "Khác" },
                        ].map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="flex cursor-pointer flex-col items-center gap-2"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-blue-50 hover:text-blue-600">
                                    <Icon size={19} />
                                </div>

                                <span className="text-[11px] text-gray-500">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-2 bg-gray-100" />

                {/* Shared media */}
                <section className="border-b border-gray-100 px-5 py-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Ảnh và video
                        </h3>

                        <span className="cursor-pointer text-xs font-medium text-blue-500">
                            Xem tất cả
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {[
                            "https://picsum.photos/id/1011/200/200",
                            "https://picsum.photos/id/1015/200/200",
                            "https://picsum.photos/id/1016/200/200",
                            "https://picsum.photos/id/1025/200/200",
                        ].map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt=""
                                className="aspect-square w-full cursor-pointer rounded-lg object-cover transition hover:opacity-80"
                            />
                        ))}
                    </div>
                </section>

                {/* Menu groups */}
                {menuGroups.map((group) => (
                    <section
                        key={group.title}
                        className="border-b border-gray-100 px-3 py-5"
                    >
                        <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            {group.title}
                        </h3>

                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50 ${
                                            item.danger
                                                ? "text-red-500"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        <Icon
                                            size={19}
                                            className={
                                                item.danger
                                                    ? "text-red-400"
                                                    : "text-gray-500"
                                            }
                                        />

                                        <span className="flex-1 text-[13px] font-medium">
                                            {item.label}
                                        </span>

                                        <ChevronRight
                                            size={16}
                                            className="text-gray-300"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </aside>
    );
};

export default InfoSidebar;

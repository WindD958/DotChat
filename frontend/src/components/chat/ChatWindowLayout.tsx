import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import InfoSidebar from "../infoChat/InfoSidebar";
import { cn } from "@/lib/utils";

const ChatWindowLayout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        activeConversationId,
        conversations,
        messageLoading: loading,
        messages,
        markAsSeen,
    } = useChatStore();

    const selectedConvo =
        conversations.find((c) => c._id === activeConversationId) ?? null;

    useEffect(() => {
        if (!selectedConvo) {
            return;
        }

        const markSeen = async () => {
            try {
                await markAsSeen();
            } catch (error) {
                console.error("Lỗi khi markSeen", error);
            }
        };

        markSeen();
    }, [markAsSeen, selectedConvo]);

    if (!selectedConvo) {
        return <ChatWelcomeScreen />;
    }

    if (loading) {
        return <ChatWindowSkeleton />;
    }

    return (
        <SidebarInset className="flex flex-row h-full overflow-hidden rounded-sm shadow-md relative">
            <div className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
                {/* Header */}
                <ChatWindowHeader
                    chat={selectedConvo}
                    onToggle={() => setIsOpen((prev) => !prev)}
                />

                {/* Body */}
                <div className="flex-1 overflow-y-auto bg-primary-foreground">
                    <ChatWindowBody />
                </div>

                {/* Footer */}
                <MessageInput selectedConvo={selectedConvo} />
            </div>

            <div
                className={cn(
                    "h-full max-lg:absolute top-0 right-0 w-0 z-10 transition-all duration-250 ease-linear",
                    isOpen ? "w-[320px]" : "w-0",
                )}
            >
                <InfoSidebar
                    convo={selectedConvo}
                    onToggle={() => setIsOpen((prev) => !prev)}
                />
            </div>
        </SidebarInset>
    );
};

export default ChatWindowLayout;

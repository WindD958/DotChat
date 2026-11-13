import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";
import { usePresenceStore } from "./usePresenceStore";
import type { PresenceItem } from "@/types/presence";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    connectSocket: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const exitingSocket = get().socket;

        if (exitingSocket) return;

        const socket: Socket = io(baseUrl, {
            auth: { token: accessToken },
            transports: ["websocket"],
            autoConnect: false,
        });

        set({ socket });

        socket.on("connect", () => {
            console.log("Đã kết nối với socket");
        });

        socket.on("presence-snapshot", (items: PresenceItem[]) => {
            const presenceStore = usePresenceStore.getState();

            // Cập nhật danh sách trạng thái
            items.forEach((item) => {
                presenceStore.setPresence(item.userId, {
                    isOnline: item.isOnline,
                    lastOnline: item.lastOnline,
                });
            });
        });

        socket.on("presence-update", (item: PresenceItem) => {
            usePresenceStore.getState().setPresence(item.userId, {
                isOnline: item.isOnline,
                lastOnline: item.lastOnline,
            });
        });

        socket.on("presence-hidden", ({ userId }: { userId: string }) => {
            usePresenceStore.getState().removePresence(userId);
        });

        // New Message
        socket.on("new-message", ({ message, conversation, unreadCounts }) => {
            useChatStore.getState().addMessage(message);

            const lastMessage = {
                _id: conversation.lastMessage._id,
                content: conversation.lastMessage.content,
                createdAt: conversation.lastMessage.createdAt,
                sender: {
                    _id: conversation.lastMessage.senderId,
                    displayName: "",
                    avatarUrl: null,
                },
            };

            const updatedConversation = {
                ...conversation,
                lastMessage,
                unreadCounts,
            };

            if (
                useChatStore.getState().activeConversationId ===
                message.conversationId
            ) {
                useChatStore.getState().markAsSeen();
            }

            useChatStore.getState().updateConversation(updatedConversation);
        });

        // Read Message
        socket.on("read-message", ({ conversation, lastMessage }) => {
            useChatStore.setState((state) => ({
                conversations: state.conversations.map((c) =>
                    c._id === conversation._id
                        ? {
                              ...c,
                              seenBy: conversation.seenBy,
                              unreadCounts: conversation.unreadCounts,
                              lastMessage,
                          }
                        : c,
                ),
            }));
        });

        // New Group Chat
        socket.on("new-group", (conversation) => {
            useChatStore.getState().addConvo(conversation);
            socket.emit("join-conversation", conversation._id);
        });
        socket.connect();
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));

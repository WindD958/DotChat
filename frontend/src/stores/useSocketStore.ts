import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/store";
import { useChatStore } from "./useChatStore";
import { usePresenceStore } from "./usePresenceStore";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    onlineUsers: [],
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

        // Danh sách người dùng đang Online
        socket.on("online-users", (userIds: string[]) => {
            set({ onlineUsers: userIds });

            const setUserOnline = usePresenceStore.getState().setUserOnline;

            const onlineSet = new Set(userIds);

            // Cập nhật trạng thái các user có trong danh sách
            onlineSet.forEach((userId) => {
                setUserOnline(userId);
            });
        });

        // Người dùng vừa Online
        socket.on("user-online", ({ userId }: { userId: string }) => {
            set((state) => ({
                onlineUsers: state.onlineUsers.includes(userId)
                    ? state.onlineUsers
                    : [...state.onlineUsers, userId],
            }));

            usePresenceStore.getState().setUserOnline(userId);
        });

        // Người dùng vừa Offline
        socket.on(
            "user-offline",
            ({
                userId,
                lastOnline,
            }: {
                userId: string;
                lastOnline: string;
            }) => {
                set((state) => ({
                    onlineUsers: state.onlineUsers.filter(
                        (id) => id !== userId,
                    ),
                }));

                usePresenceStore.getState().setUserOffline(userId, lastOnline);
            },
        );

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

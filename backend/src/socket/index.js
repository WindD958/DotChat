import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";
import User from "../models/User.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

io.use(socketAuthMiddleware);

// Map<userId, Set<socketId>>
const onlineUsers = new Map();
const disconnectTimers = new Map();

io.on("connection", async (socket) => {
    const user = socket.user;
    const userId = user._id.toString();

    // Hủy timeout Offline nếu người dùng reconnect
    const disconnectTimer = disconnectTimers.get(userId);

    if (disconnectTimer) {
        clearTimeout(disconnectTimer);
        disconnectTimers.delete(userId);
    }

    // Kiểm tra đây có phải kết nối đầu tiên không
    let userSockets = onlineUsers.get(userId);

    const isFirstConnection = !userSockets || userSockets.size === 0;

    if (!userSockets) {
        userSockets = new Set();
        onlineUsers.set(userId, userSockets);
    }

    // Thêm socket hiện tại
    userSockets.add(socket.id);

    // Gửi danh sách người dùng đang Online cho client vừa kết nối
    socket.emit("online-users", Array.from(onlineUsers.keys()));

    // Chỉ cập nhật và thông báo khi kết nối đầu tiên
    if (isFirstConnection) {
        await User.findByIdAndUpdate(userId, {
            $set: {
                isOnline: true,
            },
        });

        io.emit("user-online", {
            userId,
        });
    }

    // Join các conversation của người dùng
    const conversationIds = await getUserConversationsForSocketIO(user._id);

    conversationIds.forEach((id) => {
        socket.join(id);
    });

    socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId);
    });

    // Join room riêng của user
    socket.join(userId);

    // Disconnect
    socket.on("disconnect", async () => {
        const sockets = onlineUsers.get(userId);

        if (!sockets) return;

        sockets.delete(socket.id);

        // Vẫn còn socket khác thì không Offline
        if (sockets.size > 0) return;

        // Chờ 2 giây trước khi xác nhận Offline
        const timer = setTimeout(async () => {
            try {
                // Kiểm tra lại người dùng đã reconnect chưa
                const currentSockets = onlineUsers.get(userId);

                if (currentSockets && currentSockets.size > 0) {
                    return;
                }

                onlineUsers.delete(userId);
                disconnectTimers.delete(userId);

                const lastOnline = new Date();

                await User.findByIdAndUpdate(userId, {
                    $set: {
                        isOnline: false,
                        lastOnline,
                    },
                });

                io.emit("user-offline", {
                    userId,
                    lastOnline: lastOnline.toISOString(),
                });
            } catch (error) {
                console.error("Lỗi cập nhật Offline:", error);
            }
        }, 2000);

        disconnectTimers.set(userId, timer);
    });
});

export { io, app, server };

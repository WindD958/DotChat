import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationsForSocketIO } from "../controllers/conversationController.js";
import User from "../models/User.js";
import { canViewPresence } from "../services/presenceService.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

const getOnlineUserIds = () => {
    return [...onlineUsers.entries()]
        .filter(([, sockets]) => sockets.size > 0)
        .map(([userId]) => userId);
};

const getOnlineUsers = async () => {
    const ids = getOnlineUserIds();

    return User.find({
        _id: { $in: ids },
    })
        .select("_id isOnline lastOnline settings")
        .lean();
};

const sendPresenceSnapshot = async (socket, viewerId) => {
    const [viewer, onlineUsersData] = await Promise.all([
        User.findById(viewerId).select("_id settings").lean(),

        getOnlineUsers(),
    ]);

    if (!viewer) return;

    const snapshot = onlineUsersData
        .filter((target) => canViewPresence(viewer, target))

        .map((target) => ({
            userId: target._id.toString(),
            isOnline: true,
            lastOnline: target.lastOnline ?? null,
        }));
    socket.emit("presence-snapshot", snapshot);
};

const broadcastPresence = async (targetId, presence) => {
    const [target, viewers] = await Promise.all([
        User.findById(targetId).select("_id settings").lean(),

        getOnlineUsers(),
    ]);

    if (!target) return;

    for (const viewer of viewers) {
        const viewerId = viewer._id.toString();
        const targetUserId = target._id.toString();

        if (viewerId === targetUserId) continue;

        if (canViewPresence(viewer, target)) {
            io.to(viewerId).emit("presence-update", {
                userId: targetUserId,
                ...presence,
            });
        } else {
            io.to(viewerId).emit("presence-hidden", {
                userId: targetUserId,
            });
        }
    }
};

export const refreshPresenceForUser = async (userId) => {
    const [changedUser, onlineUsersData] = await Promise.all([
        User.findById(userId).select("_id isOnline lastOnline settings").lean(),

        getOnlineUsers(),
    ]);

    if (!changedUser) return;

    const changedId = changedUser._id.toString();

    for (const otherUser of onlineUsersData) {
        const otherId = otherUser._id.toString();

        if (otherId === changedId) continue;

        const allowed = canViewPresence(changedUser, otherUser);

        if (allowed) {
            // Người thay đổi cài đặt có thể xem người kia
            io.to(changedId).emit("presence-update", {
                userId: otherId,
                isOnline: otherUser.isOnline ?? false,
                lastOnline: otherUser.lastOnline ?? null,
            });

            // Người kia có thể xem người thay đổi cài đặt
            io.to(otherId).emit("presence-update", {
                userId: changedId,
                isOnline: changedUser.isOnline ?? false,
                lastOnline: changedUser.lastOnline ?? null,
            });
        } else {
            // Hai bên đều phải xóa trạng thái của nhau
            io.to(changedId).emit("presence-hidden", {
                userId: otherId,
            });

            io.to(otherId).emit("presence-hidden", {
                userId: changedId,
            });
        }
    }
};

io.use(socketAuthMiddleware);

// Map<userId, Set<socketId>>
const onlineUsers = new Map();
const disconnectTimers = new Map();

io.on("connection", async (socket) => {
    const user = socket.user;
    const userId = user._id.toString();

    socket.join(userId);

    let userSockets = onlineUsers.get(userId);

    if (!userSockets) {
        userSockets = new Set();
        onlineUsers.set(userId, userSockets);
    }

    // Hủy bộ đếm Offline nếu người dùng kết nối lại
    const disconnectTimer = disconnectTimers.get(userId);

    if (disconnectTimer) {
        clearTimeout(disconnectTimer);
        disconnectTimers.delete(userId);
    }

    const isFirstConnection = userSockets.size === 0;

    userSockets.add(socket.id);

    if (isFirstConnection) {
        await User.findByIdAndUpdate(userId, {
            $set: { isOnline: true },
        });

        // Thông báo cho các client có quyền xem
        await broadcastPresence(userId, {
            isOnline: true,
            lastOnline: user.lastOnline ?? null,
        });
    }

    // Gửi trạng thái được phép xem cho socket mới
    await sendPresenceSnapshot(socket, userId);

    // Join các conversation của người dùng
    const conversationIds = await getUserConversationsForSocketIO(user._id);

    conversationIds.forEach((id) => {
        socket.join(id);
    });

    socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId);
    });

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

                await broadcastPresence(userId, {
                    isOnline: false,
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

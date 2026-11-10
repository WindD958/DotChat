import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { usePresenceStore } from "./usePresenceStore";

export const useFriendStore = create<FriendState>((set, get) => ({
    friends: [],
    loading: false,
    receivedList: [],
    sentList: [],
    searchByUsername: async (username) => {
        try {
            set({ loading: true });

            const user = await friendService.searchByUsername(username);

            return user;
        } catch (error) {
            console.error("Lỗi xảy ra khi tìm user bằng username", error);
            return null;
        } finally {
            set({ loading: false });
        }
    },
    addFriend: async (to, message) => {
        try {
            set({ loading: true });
            const resultMessage = await friendService.sendFriendRequest(
                to,
                message,
            );
            toast.success("Gửi kết bạn thành công.");
            return resultMessage;
        } catch (error) {
            console.error("Lỗi xảy ra khi addFriend", error);
            toast.error("Lỗi xảy ra khi gửi kết bạn, hãy thử lại.");
        } finally {
            set({ loading: false });
        }
    },
    getAllFriendRequest: async () => {
        try {
            set({ loading: true });

            const result = await friendService.getAllFriendRequest();

            if (!result) return;

            const { received, sent } = result;

            set({ receivedList: received, sentList: sent });
        } catch (error) {
            console.error("Lỗi xảy ra khi getAllFriendRequest", error);
        } finally {
            set({ loading: false });
        }
    },
    acceptRequest: async (requestId) => {
        try {
            set({ loading: true });
            await friendService.acceptRequest(requestId);

            set((state) => ({
                receivedList: state.receivedList.filter(
                    (r) => r._id !== requestId,
                ),
            }));
        } catch (error) {
            console.error("Lỗi xảy ra khi acceptRequest", error);
        } finally {
            set({ loading: false });
        }
    },
    declineRequest: async (requestId) => {
        try {
            set({ loading: true });
            await friendService.declineRequest(requestId);

            set((state) => ({
                receivedList: state.receivedList.filter(
                    (r) => r._id !== requestId,
                ),
            }));
        } catch (error) {
            console.error("Lỗi xảy ra khi declineRequest", error);
        } finally {
            set({ loading: false });
        }
    },
    getFriends: async () => {
        try {
            set({ loading: true });
            const friends = await friendService.getFriendList();
            usePresenceStore.getState().setPresences(friends);
            set({ friends: friends });
        } catch (error) {
            console.error("Lỗi xảy ra khi load friends", error);
            set({ friends: [] });
        } finally {
            set({ loading: false });
        }
    },
}));

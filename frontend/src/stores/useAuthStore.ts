import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            user: null,
            loading: false,

            setAccessToken: (accessToken) => {
                set({ accessToken });
            },

            clearState: () => {
                set({ accessToken: null, user: null, loading: false });
                localStorage.clear();
                useChatStore.getState().reset();
            },

            signUp: async (username, password, email, firstname, lastname) => {
                try {
                    set({ loading: true });

                    await authService.signUp(
                        username,
                        password,
                        email,
                        firstname,
                        lastname,
                    );

                    toast.success(
                        "Đăng ký thành công. Bạn sẽ được chuyển sang trang đăng nhập.",
                    );
                } catch (error) {
                    console.error(error);
                    toast.error("Đăng ký thất bại.");
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            signIn: async (username, password) => {
                try {
                    set({ loading: true });

                    localStorage.clear();
                    useChatStore.getState().reset();

                    const { accessToken } = await authService.signIn(
                        username,
                        password,
                    );
                    get().setAccessToken(accessToken);

                    await get().fetchMe();
                    useChatStore.getState().fetchConversations();

                    toast.success("Chào mừng bạn quay lại với DotChat.");
                } catch (error) {
                    console.error(error);
                    toast.error("Đăng nhập thất bại.");
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            signOut: async () => {
                try {
                    get().clearState();
                    await authService.signOut();
                    toast.success("Đăng xuất thành công.");
                } catch (error) {
                    console.error(error);
                    toast.error("Lỗi đã xảy ra khi đăng xuất, hãy thử lại.");
                }
            },

            fetchMe: async () => {
                try {
                    set({ loading: true });
                    const user = await authService.fetchMe();

                    set(user);
                } catch (error) {
                    console.error(error);
                    set({ user: null, accessToken: null });
                    toast.error(
                        "Lỗi xảy ra khi lấy dữ liệu người dùng, hãy thử lại.",
                    );
                } finally {
                    set({ loading: false });
                }
            },

            refresh: async () => {
                try {
                    set({ loading: true });
                    const { user, fetchMe, setAccessToken } = get();
                    const accessToken = await authService.refresh();

                    setAccessToken(accessToken);

                    if (!user) {
                        await fetchMe();
                    }
                } catch (error) {
                    console.error(error);
                    toast.error(
                        "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại. ",
                    );
                    get().clearState();
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }),
        },
    ),
);

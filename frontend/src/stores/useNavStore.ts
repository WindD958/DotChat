import type { Navigation } from "@/types/store";
import { create } from "zustand";

export const useNavigationStore = create<Navigation>((set) => ({
    activeSection: "messages",

    setActiveSection: (section) => set({ activeSection: section }),
}));

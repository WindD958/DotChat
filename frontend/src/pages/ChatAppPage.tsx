import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar";

const ChatAppPage = () => {
    return (
        <SidebarProvider>
            <AppSidebar />

            <div className="flex h-screen w-full">
                <ChatWindowLayout />
            </div>
        </SidebarProvider>
    );
};

export default ChatAppPage;

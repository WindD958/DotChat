import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import { Label } from "@/components/ui/label";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutGrid, MessageSquare, Moon, Sun, Users } from "lucide-react";
import ChatList from "../chat/ChatList";
import { Switch } from "../ui/switch";
import { useNavigationStore } from "@/stores/useNavStore";
import Contacts from "../chat/Contacts";
import Discover from "../chat/Discover";
import { useThemeStore } from "@/stores/useThemeStore";
import { useAuthStore } from "@/stores/useAuthStore";

const navItems = [
    {
        id: "messages",
        label: "Tin nhắn",
        icon: <MessageSquare />,
    },
    {
        id: "contacts",
        label: "Bạn bè",
        icon: <Users />,
    },
    {
        id: "discover",
        label: "Khám phá",
        icon: <LayoutGrid />,
    },
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const activeSection = useNavigationStore((state) => state.activeSection);

    const setActiveSection = useNavigationStore(
        (state) => state.setActiveSection,
    );

    const { isDark, toggleTheme } = useThemeStore();
    const { user } = useAuthStore();

    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
            {...props}
        >
            {/* Left Sidebar */}
            <Sidebar
                collapsible="none"
                className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r bg-sidebar-nav"
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="md:h-8 md:p-0"
                                render={<a href="#" />}
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                    <img src="/logo.svg" alt="logo" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        DotChat
                                    </span>
                                    <span className="truncate text-xs">
                                        Realtime app
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0 ">
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                        <SidebarMenuButton
                                            tooltip={{
                                                children: item.label,
                                                hidden: false,
                                            }}
                                            onClick={() => {
                                                setActiveSection(item.id);
                                            }}
                                            isActive={activeSection === item.id}
                                            className="px-2.5 md:px-2"
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
            </Sidebar>

            {/* Sidebar Content */}
            <Sidebar collapsible="none" className="hidden flex-1 md:flex ">
                <SidebarHeader className="gap-3.5 border-b p-4 border-sidebar-border bg-gradient-primary">
                    <div className="flex w-full items-center justify-between ">
                        <div className="text-base font-medium text-white/90">
                            {
                                navItems.find(
                                    (item) => item.id === activeSection,
                                )?.label
                            }
                        </div>
                        <Label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Sun className="size-4 text-white/80" />
                            <Switch
                                className="shadow-none bg-white/70"
                                checked={isDark}
                                onCheckedChange={toggleTheme}
                            />
                            <Moon className="size-4 text-white/80" />
                        </Label>
                    </div>
                </SidebarHeader>
                <SidebarContent className="beautiful-scrollbar">
                    <SidebarGroup className="px-0 pt-0">
                        <SidebarGroupContent>
                            {activeSection === "messages" && <ChatList />}
                            {activeSection === "contacts" && <Contacts />}
                            {activeSection === "discover" && <Discover />}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </Sidebar>
    );
}

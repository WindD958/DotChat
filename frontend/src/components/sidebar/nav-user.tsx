import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import type { User } from "@/types/user";
import { Bell, UserIcon } from "lucide-react";
import Logout from "../auth/Logout";

export function NavUser({ user }: { user: User }) {
    const { isMobile } = useSidebar();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="md:h-8 md:p-0 data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                            />
                        }
                    >
                        <Avatar className="h-8 w-8 rounded-lg after:border-none">
                            <AvatarImage
                                src={user.avatarUrl}
                                alt={user.displayName}
                            />
                            <AvatarFallback className="rounded-lg ">
                                {user.displayName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {user.displayName}
                            </span>
                            <span className="truncate text-xs">
                                {user.username}
                            </span>
                        </div>
                        <HugeiconsIcon
                            icon={UnfoldMoreIcon}
                            strokeWidth={2}
                            className="ml-auto size-4"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="min-w-50 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg after:border-none">
                                        <AvatarImage
                                            src={user.avatarUrl}
                                            alt={user.displayName}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            {user.displayName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {user.displayName}
                                        </span>
                                        <span className="truncate text-xs">
                                            DotChat ID: {user.username}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserIcon />
                                Tài khoản
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Bell />
                                Thông báo
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            <Logout />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

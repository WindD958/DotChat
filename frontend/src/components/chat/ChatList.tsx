import { SidebarHeader, SidebarInput } from "../ui/sidebar";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import CreateNewChat from "./CreateNewChat";
import AddFriendModal from "./AddFriendModal";
import NewGroupChatModal from "./NewGroupChatModal";
import { useChatStore } from "@/stores/useChatStore";
import MessageCard from "./MessageCard";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ChatList = () => {
    const { conversations } = useChatStore();

    if (!conversations) return;

    return (
        <div>
            <SidebarHeader className="gap-3.5 border-b p-4 border-sidebar-border">
                <div className="flex gap-2">
                    <SidebarInput placeholder="Tìm kiếm..." />

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={<Button variant="outline" size="lg" />}
                        >
                            <Plus />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="min-w-45 rounded-lg"
                            side={"bottom"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <CreateNewChat />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <AddFriendModal />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <NewGroupChatModal />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarHeader>
            <div>
                {conversations.map((convo) => (
                    <MessageCard convo={convo} key={convo._id} />
                ))}
            </div>
        </div>
    );
};

export default ChatList;

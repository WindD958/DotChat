import { MessageCirclePlus, Plus, UserPlus, Users } from "lucide-react";
import { Button } from "../ui/button";
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
import { useFriendStore } from "@/stores/useFriendStore";
import { Input } from "../ui/input";

type DialogType = "createchat" | "addfriend" | "newgroup" | null;

interface Props {
    onOpenDialog: (type: DialogType) => void;
}

const ChatList = ({ onOpenDialog }: Props) => {
    const { conversations } = useChatStore();

    if (!conversations) return;

    const { getFriends } = useFriendStore();

    const handleGetFriends = async () => {
        await getFriends();
    };

    return (
        <div>
            <div className="gap-3.5 border-b p-4 border-sidebar-border">
                <div className="flex gap-2">
                    <Input placeholder="Tìm kiếm cuộc trò chuyện..." />

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="cursor-pointer"
                            render={<Button variant="outline" size="icon" />}
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
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                        handleGetFriends();
                                        onOpenDialog("createchat");
                                    }}
                                >
                                    <MessageCirclePlus className="size-4" />
                                    Trò chuyện mới
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                        onOpenDialog("addfriend");
                                    }}
                                >
                                    <UserPlus className="size-4" />
                                    Thêm bạn bè
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                        handleGetFriends();
                                        onOpenDialog("newgroup");
                                    }}
                                >
                                    <Users className="size-4" />
                                    Tạo nhóm
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div>
                {conversations.map((convo) => (
                    <MessageCard convo={convo} key={convo._id} />
                ))}
            </div>
        </div>
    );
};

export default ChatList;

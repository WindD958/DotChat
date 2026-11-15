import {
    MessageCirclePlus,
    Plus,
    SearchIcon,
    UserPlus,
    Users,
    X,
} from "lucide-react";
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
import { useRef, useState } from "react";
import SearchFriendList from "../createNewChat/SearchFriendList";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";

type DialogType = "createchat" | "addfriend" | "newgroup" | null;

interface Props {
    onOpenDialog: (type: DialogType) => void;
}

const ChatList = ({ onOpenDialog }: Props) => {
    const { conversations } = useChatStore();
    const [search, setSearch] = useState("");
    const [focus, setFocus] = useState(false);
    const { friends, getFriends } = useFriendStore();
    const inputRef = useRef<HTMLInputElement>(null);

    if (!conversations) return;

    const handleGetFriends = async () => {
        await getFriends();
    };

    const onSelect = () => {
        setFocus(false);
        setSearch("");
        inputRef.current?.blur();
    };

    const filteredFriends = friends.filter(
        (friend) =>
            friend.displayName.toLowerCase().includes(search.toLowerCase()) ||
            friend.username.includes(search),
    );

    return (
        <div>
            <div className="gap-3.5 border-b p-4 border-sidebar-border">
                <div className="flex gap-2">
                    <InputGroup>
                        <InputGroupInput
                            ref={inputRef}
                            id="inline-start-input"
                            value={search}
                            onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                        />
                        <InputGroupAddon align="inline-start">
                            <SearchIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                        {search && (
                            <InputGroupAddon align="inline-end">
                                <Button
                                    onClick={() => {
                                        setSearch("");
                                        inputRef.current?.focus();
                                    }}
                                    className="rounded-sm size-5 cursor-pointer bg-primary/8 hover:bg-primary/15"
                                >
                                    <X className="text-muted-foreground" />
                                </Button>
                            </InputGroupAddon>
                        )}
                    </InputGroup>

                    {search && focus && filteredFriends.length > 0 && (
                        <SearchFriendList
                            onSelect={onSelect}
                            filterFriends={filteredFriends}
                        />
                    )}

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

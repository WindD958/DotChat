import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IUserAvatarProps {
    type: "sidebar" | "mess" | "chat" | "profile" | "seenStatus" | "groupInfo";
    name?: string;
    avatarUrl?: string;
    className?: string;
}

const UserAvatar = ({ type, name, avatarUrl, className }: IUserAvatarProps) => {
    const bgColor = !avatarUrl ? "bg-violet-400" : "";

    if (!name) {
        name = "DotChat";
    }

    return (
        <Avatar
            className={cn(
                "after:border-none",
                type === "sidebar" && "size-12 text-base ",
                type === "mess" && "size-8 text-base ",
                type === "chat" && "size-10 text-sm",
                type === "profile" && "size-20 text-3xl shadow-md",
                type === "seenStatus" && "size-3.5 text-xs!",
            )}
        >
            <AvatarImage className="rounded-sm" src={avatarUrl} alt={name} />
            <AvatarFallback
                className={cn(
                    `${bgColor} text-white font-semibold rounded-sm`,
                    type === "sidebar" && "text-base ",
                    type === "mess" && "text-xs ",
                    type === "chat" && "text-sm",
                    type === "profile" && "text-3xl shadow-md",
                    type === "seenStatus" && "text-[8px] rounded-sm",
                )}
            >
                {name.charAt(0)}
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;

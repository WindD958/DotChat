import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IUserAvatarProps {
    type: "sidebar" | "mess" | "chat" | "profile";
    name: string;
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
            )}
        >
            <AvatarImage className="rounded-sm" src={avatarUrl} alt={name} />
            <AvatarFallback
                className={`${bgColor} text-white font-semibold rounded-sm ring-2 ring-background`}
            >
                {name.charAt(0)}
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;

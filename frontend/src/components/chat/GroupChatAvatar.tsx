import type { Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupChatAvatarProps {
    participants: Participant[];
    type: "chat" | "mess";
}

const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
    const avatars = [];
    const limit = Math.min(participants.length, 2);

    for (let i = 0; i < limit; i++) {
        const member = participants[i];
        avatars.push(
            <UserAvatar
                key={i}
                type={type}
                name={member.displayName}
                avatarUrl={member.avatarUrl ?? undefined}
            />,
        );
    }

    return (
        <div className="relative flex -space-x-2 *data-[slot=avatar]:ring-background *data-[slot=avatar]:ring-2">
            {avatars}

            {participants.length > limit && (
                <div
                    className={cn(
                        "flex items-center z-10 justify-center size-8 bg-muted ring-2 ring-background rounded-sm text-muted",
                        type === "chat" && "size-10",
                    )}
                >
                    <Ellipsis className="size-4 text-muted-foreground" />
                </div>
            )}
        </div>
    );
};

export default GroupChatAvatar;

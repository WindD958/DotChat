import type { SeenUser } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SeenByAvatarProps {
    seenByList: SeenUser[];
    type: "chat" | "mess" | "seenStatus";
}

const SeenByAvatar = ({ seenByList, type }: SeenByAvatarProps) => {
    const avatars = [];
    const seenList = [];
    let seenName = "";
    const limit = Math.min(seenByList.length, 5);

    for (let i = 0; i < limit; i++) {
        const member = seenByList[i];
        avatars.push(
            <UserAvatar
                key={i}
                type={type}
                name={member.displayName}
                avatarUrl={member.avatarUrl ?? undefined}
            />,
        );
        if (i === seenByList.length - 1) {
            seenName += `${member.displayName}`;
        } else if (i === limit - 1) {
            seenName += `${member.displayName},...`;
        } else if (i < limit) {
            seenName += `${member.displayName}, `;
        }
    }

    for (let i = 0; i < seenByList.length; i++) {
        const member = seenByList[i];
        seenList.push(
            <div key={i} className="flex gap-2 py-2">
                <div>
                    <UserAvatar
                        type="chat"
                        name={member.displayName}
                        avatarUrl={member.avatarUrl ?? undefined}
                    />
                </div>
                <div>
                    <h1 className="font-semibold text-md">
                        {member.displayName}
                    </h1>
                </div>
            </div>,
        );
    }

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger
                    className="cursor-pointer"
                    render={
                        <DialogTrigger className="cursor-pointer">
                            <div className="relative flex gap-0.5 *data-[slot=avatar]:ring-background *data-[slot=avatar]:ring-2">
                                {avatars}

                                {seenByList.length > limit && (
                                    <div
                                        className={cn(
                                            "flex items-center z-10 justify-center size-4 bg-muted ring-2 ring-background rounded-sm text-muted",
                                            type === "chat" && "size-10",
                                        )}
                                    >
                                        <Ellipsis className="size-3 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </DialogTrigger>
                    }
                ></TooltipTrigger>

                <TooltipContent>
                    <p>{seenName}</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent className="max-w-2xs!">
                <DialogHeader>
                    <DialogTitle>Đã xem</DialogTitle>
                </DialogHeader>

                <div className="divide-y">{seenList}</div>
            </DialogContent>
        </Dialog>
    );
};

export default SeenByAvatar;

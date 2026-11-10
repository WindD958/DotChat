import { Card } from "../ui/card";
import { formatOnlineTime, cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

interface ChatCardProps {
    convoId: string;
    name: string;
    timestamp?: Date;
    isActive: boolean;
    onSelect: (id: string) => void;
    unreadCount?: number;
    leftSection: React.ReactNode;
    subtitle: React.ReactNode;
}

const ChatCard = ({
    convoId,
    name,
    timestamp,
    isActive,
    onSelect,
    unreadCount,
    leftSection,
    subtitle,
}: ChatCardProps) => {
    return (
        <Card
            key={convoId}
            className={cn(
                "min-h-18 border-b ring-0 rounded-none p-3 cursor-pointer transition-smooth bg-gray-100 dark:bg-black/5 hover:bg-primary/8",
                isActive &&
                    "bg-primary/20 hover:bg-primary/20 dark:bg-primary/40",
            )}
            onClick={() => onSelect(convoId)}
        >
            <div className="flex items-center gap-3">
                <div className="relative">{leftSection}</div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3
                            className={cn(
                                "font-semibold text-sm truncate",
                                unreadCount &&
                                    unreadCount > 0 &&
                                    "text-foreground",
                            )}
                        >
                            {name}
                        </h3>

                        <span className="text-xs text-muted-foreground">
                            {timestamp ? formatOnlineTime(timestamp) : ""}
                        </span>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                            {subtitle}
                        </div>
                        <MoreHorizontal className="size-5 text-muted-foreground md:opacity-0 hover:scale-120 group-hover:opacity-100 transition-smooth" />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ChatCard;

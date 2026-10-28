import { useThemeStore } from "@/stores/useThemeStore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import vi from "emoji-picker-react/data/emojis-vi";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

const EmojiPickerChat = ({ onChange }: EmojiPickerProps) => {
    const { isDark } = useThemeStore();

    return (
        <Popover>
            <PopoverTrigger className="cursor-pointer">
                <Smile className="size-4" />
            </PopoverTrigger>
            <PopoverContent
                align="center"
                sideOffset={40}
                className=" w-auto h-auto border-none drop-shadow-none shadow-none"
            >
                <EmojiPicker
                    className="chat-picker"
                    emojiData={vi}
                    width={280}
                    height={400}
                    colorScheme={isDark ? "dark" : "light"}
                    previewConfig={{ showPreview: false }}
                    onEmojiClick={(emojiData) => onChange(emojiData.emoji)}
                />
            </PopoverContent>
        </Popover>
    );
};

export default EmojiPickerChat;

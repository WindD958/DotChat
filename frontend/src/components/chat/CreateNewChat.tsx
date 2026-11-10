import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import FriendListModal from "../createNewChat/FriendListModal";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const CreateNewChat = ({ open, onOpenChange }: Props) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-none">
                <DialogHeader>
                    <DialogTitle>Trò chuyện mới</DialogTitle>
                </DialogHeader>
                <FriendListModal onOpenChange={onOpenChange} />
            </DialogContent>
        </Dialog>
    );
};

export default CreateNewChat;

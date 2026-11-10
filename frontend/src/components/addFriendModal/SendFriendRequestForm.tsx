import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import type { User } from "@/types/user";
import UserAvatar from "../chat/UserAvatar";

interface SendRequestProps {
    register: UseFormRegister<IFormValues>;
    loading: boolean;
    searchedUsername: string;
    searchUser: User | undefined;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}

const SendFriendRequestForm = ({
    register,
    loading,
    searchedUsername,
    searchUser,
    onSubmit,
    onBack,
}: SendRequestProps) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-4">
                <div>
                    <div className="flex p-4 gap-3 bg-gradient-primary rounded-lg">
                        <UserAvatar
                            type="profile"
                            name={searchUser?.displayName ?? "DotChat"}
                            avatarUrl={searchUser?.avatarUrl ?? undefined}
                        />
                        <div className="text-white">
                            <h2 className="font-semibold text-lg">
                                {searchUser?.displayName}
                            </h2>
                            <p className="text-xs">@{searchUser?.username}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold">
                        Giới thiệu
                    </Label>
                    <Textarea
                        id="message"
                        rows={3}
                        placeholder="Chào bạn, mình có thể kết bạn được không?"
                        className="border-border/50 focus:border-primary/50 transition-smooth resize-none"
                        {...register("message")}
                    />
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1 hover:text-destructive cursor-pointer"
                        onClick={onBack}
                    >
                        Quay lại
                    </Button>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth"
                    >
                        {loading ? (
                            <span>Đang gửi...</span>
                        ) : (
                            <>
                                <UserPlus className="size-4" />
                                Kết bạn
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </div>
        </form>
    );
};

export default SendFriendRequestForm;

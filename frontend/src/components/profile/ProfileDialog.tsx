import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import ProfileCard from "./ProfileCard";
import { useAuthStore } from "@/stores/useAuthStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PersonalInfoForm from "./PersonalInfoForm";
import PreferencesForm from "./PreferencesForm";
import PrivacySettings from "./PrivacySettings";

interface ProfileDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfileDialog = ({ open, setOpen }: ProfileDialogProps) => {
    const { user } = useAuthStore();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hồ sơ và chỉnh sửa</DialogTitle>
                </DialogHeader>
                {/* <div className="bg-transparent">
                    <div className="max-w-4xl mx-auto p-4">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-foreground">
                                Hồ sơ và chỉnh sửa
                            </h1>
                        </div>
                    </div>
                </div> */}

                <ProfileCard user={user} />

                <Tabs
                    defaultValue="personal"
                    className="my-4 w-full flex flex-col"
                >
                    <TabsList className="grid w-full grid-cols-3 glass-light">
                        <TabsTrigger
                            value="personal"
                            className="cursor-pointer data-[state=active]:glass-strong"
                        >
                            Tài Khoản
                        </TabsTrigger>
                        <TabsTrigger
                            value="preferences"
                            className="cursor-pointer data-[state=active]:glass-strong"
                        >
                            Cấu Hình
                        </TabsTrigger>
                        <TabsTrigger
                            value="privacy"
                            className="cursor-pointer data-[state=active]:glass-strong"
                        >
                            Bảo Mật
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">
                        <PersonalInfoForm userInfo={user} />
                    </TabsContent>

                    <TabsContent value="preferences">
                        <PreferencesForm />
                    </TabsContent>

                    <TabsContent value="privacy">
                        <PrivacySettings />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;

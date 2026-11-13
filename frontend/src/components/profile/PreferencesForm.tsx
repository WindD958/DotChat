import { Sun, Moon } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useFriendStore } from "@/stores/useFriendStore";

const PreferencesForm = () => {
    const { isDark, toggleTheme } = useThemeStore();
    const settings = useSettingsStore((state) => state.settings);
    const fetchSettings = useSettingsStore((state) => state.fetchSettings);

    const updatePrivacy = useSettingsStore((state) => state.updatePrivacy);

    const fetchFriends = useFriendStore((state) => state.getFriends);

    useEffect(() => {
        if (!settings) {
            fetchSettings();
        }
    }, [settings, fetchSettings]);

    const handleOnlineStatus = async (checked: boolean) => {
        try {
            await updatePrivacy({
                hideActivityStatus: !checked,
            });

            await fetchFriends();
        } catch (error) {
            console.error("Không thể cập nhật cài đặt:", error);
        }
    };

    const onlineStatus = settings?.privacy.hideActivityStatus ?? false;

    return (
        <Card className="glass-strong border-border/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-primary" />
                    Tuỳ chỉnh ứng dụng
                </CardTitle>
                <CardDescription>
                    Cá nhân hoá trải nghiệm trò chuyện của bạn
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                    <div>
                        <Label
                            htmlFor="theme-toggle"
                            className="text-base font-medium"
                        >
                            Chế độ tối
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Chuyển đổi giữa giao diện sáng và tối
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-muted-foreground" />
                        <Switch
                            id="theme-toggle"
                            checked={isDark}
                            onCheckedChange={toggleTheme}
                            className="data-[state=checked]:bg-primary-glow"
                        />
                        <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {/* Online Status */}
                <div className="flex items-center justify-between">
                    <div>
                        <Label
                            htmlFor="online-status"
                            className="text-base font-medium"
                        >
                            Trạng thái hoạt động
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Cho phép người khác thấy khi bạn đang online
                        </p>
                    </div>
                    <Switch
                        id="online-status"
                        checked={!onlineStatus}
                        onCheckedChange={handleOnlineStatus}
                        className="cursor-pointer data-[state=checked]:bg-primary-glow"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default PreferencesForm;

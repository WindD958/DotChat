import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut } from "lucide-react";

const Logout = () => {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button
            className="w-full flex justify-start items-center gap-2 p-0 cursor-pointer"
            variant="completeGhost"
            onClick={handleLogout}
        >
            <LogOut />
            Đăng xuất
        </Button>
    );
};

export default Logout;

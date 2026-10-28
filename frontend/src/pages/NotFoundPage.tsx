import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCallback } from "react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const handleBackToHome = () => {
        navigate("/");
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <Card className="flex items-center justify-center p-12 shadow-md">
                <div className="pulse-ring">
                    <Badge className="size-25  bg-gradient-chat border border-background">
                        <h1 className="text-3xl font-bold">404</h1>
                    </Badge>
                </div>
                <div className="flex flex-col items-center">
                    <p className="uppercase text-xs text-primary font-semibold">
                        page not found
                    </p>
                    <h2 className="text-3xl font-bold">
                        Oops! Trang không tồn tại
                    </h2>
                    <p className="text-xs mt-1 text-muted-foreground">
                        Có vẻ như trang bạn đang tìm kiếm đã bị xóa hoặc không
                        tồn tại.
                    </p>
                </div>
                <Button
                    onClick={handleBackToHome}
                    className="py-4 px-5 cursor-pointer"
                >
                    Trang chủ
                </Button>
            </Card>
        </div>
    );
};

export default NotFoundPage;

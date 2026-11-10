import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatOnlineTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMins < 60) {
        return `${diffMins}m`; // 5m, 45m
    } else if (diffHours < 24) {
        return `${diffHours}h`; // 3h, 20h
    } else if (diffDays < 30) {
        return `${diffDays}d`; // 1d, 12d
    } else if (diffMonths < 12) {
        return `${diffMonths}m`; // 1m, 2m, 11m
    } else {
        return `${diffYears}y`; // 1y, 2y
    }
};

export const formatMessageTime = (date: Date) => {
    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    if (isToday) {
        return timeStr; // ví dụ: "14:35"
    } else if (isYesterday) {
        return `Hôm qua ${timeStr}`; // ví dụ: "Hôm qua 23:10"
    } else if (date.getFullYear() === now.getFullYear()) {
        return `${date.getDate()}/${date.getMonth() + 1} ${timeStr}`; // ví dụ: "22/9 09:15"
    } else {
        return `${date.getDate()}/${
            date.getMonth() + 1
        }/${date.getFullYear()} ${timeStr}`; // ví dụ: "15/12/2023 18:40"
    }
};

export const formatOfflineTime = (
    lastOnline: string | null,
    now: number = Date.now(),
): string => {
    if (!lastOnline) return "Không hoạt động";

    const timestamp = new Date(lastOnline).getTime();

    if (Number.isNaN(timestamp)) {
        return "Không xác định";
    }

    const diff = Math.max(0, now - timestamp);

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Vừa mới truy cập";

    if (minutes < 60) {
        return `Hoạt động ${minutes} phút trước`;
    }

    if (hours < 24) {
        return `Hoạt động ${hours} giờ trước`;
    }

    if (days < 30) {
        return `Hoạt động ${days} ngày trước`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
        return `Hoạt động ${months} tháng trước`;
    }

    const years = Math.floor(days / 365);

    return `Hoạt động ${years} năm trước`;
};

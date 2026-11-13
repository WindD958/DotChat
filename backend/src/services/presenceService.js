export const canViewPresence = (viewer, target) => {
    if (!viewer || !target) return false;

    const viewerId = viewer._id.toString();
    const targetId = target._id.toString();

    // Người dùng luôn có thể xem trạng thái của chính mình
    if (viewerId === targetId) return true;

    const viewerHides = viewer.settings?.privacy?.hideActivityStatus ?? false;

    const targetHides = target.settings?.privacy?.hideActivityStatus ?? false;

    return !viewerHides && !targetHides;
};

export const getPresenceData = (user) => ({
    isOnline: user.isOnline ?? false,
    lastOnline: user.lastOnline ?? null,
});

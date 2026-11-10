import { useEffect, useState } from "react";

export const useCurrentTime = () => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 30_000);

        return () => clearInterval(interval);
    }, []);

    return now;
};

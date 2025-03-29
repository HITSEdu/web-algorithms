import {useCallback, useEffect, useState} from "react";

export const useResize = (k: number, mn: number) => {
    const [size, setSize] = useState(Math.min(mn, window.innerWidth / k));

    const handleResize = useCallback(() => {
        setSize(Math.min(mn, window.innerWidth / k));
    }, [k, mn])

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return size;
}
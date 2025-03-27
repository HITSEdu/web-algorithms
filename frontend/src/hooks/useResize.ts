import {useEffect, useState} from "react";

export const useResize = (k: number, mn: number) => {
    const [size, setSize] = useState(Math.min(mn, window.innerWidth / k));

    useEffect(() => {
        const handleResize = () => {
            setSize(Math.min(mn, window.innerWidth / k));
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return size;
}
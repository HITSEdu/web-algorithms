import {useCallback, useEffect, useState} from "react";

export const useResize = (
    k: number,
    mx: number,
    mn: number = 1,
    dimension: 'width' | 'height' | 'min' | 'max' = 'height'
) => {
    const getDimension = useCallback(() => {
        switch (dimension) {
            case 'width':
                return window.innerWidth / k;
            case 'height':
                return window.innerHeight / k;
            case 'min':
                return Math.min(window.innerWidth, window.innerHeight) / k;
            case 'max':
                return Math.max(window.innerWidth, window.innerHeight) / k;
        }
    }, [dimension, k]);

    const [size, setSize] = useState(Math.max(mn, Math.min(mx, getDimension())));

    const handleResize = useCallback(() => {
        setSize(Math.max(mn, Math.min(mx, getDimension())));
    }, [getDimension, mn, mx]);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return size;
}
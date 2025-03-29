import {useEffect, useState, useCallback} from "react";

interface useGridProps {
    initSize: number;
    minSize?: number;
    maxSize?: number;
    command: (value: number) => number;
}

export const useGrid = ({initSize, minSize = 1, maxSize = 52, command}: useGridProps) => {
    const [size, setSize] = useState(initSize);

    const sizeUp = () => {
        setSize(prevSize => Math.min(prevSize + 1, maxSize));
    }

    const sizeDown = () => {
        setSize(prevSize => Math.max(prevSize - 1, minSize));
    }

    const createEmptyGrid = useCallback(() => {
        return Array.from({length: size}, () => Array(size).fill(0));
    }, [size]);

    const [grid, setGrid] = useState(() => createEmptyGrid());

    useEffect(() => {
        setGrid(createEmptyGrid());
    }, [createEmptyGrid]);

    const handleClick = (row: number, cell: number) => {
        setGrid(prev => {
            const newGrid = prev.map(row => [...row]);
            newGrid[row][cell] = command(newGrid[row][cell]);
            return newGrid;
        });
    };

    return {grid, size, handleClick, sizeUp, sizeDown, setGrid};
}
import {useEffect, useRef, useState} from "react";

interface UseCanvasProps {
    size: number;
    pixelSize: number;
    onDraw: (x: number, y: number) => void;
}

export const useCanvas = ({size, pixelSize, onDraw}: UseCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [DrawingAbility, setDrawingAbility] = useState<boolean>(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#212024';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#2C2D30';
        for (let i = 0; i <= size; i++) {
            ctx.beginPath();
            ctx.moveTo(i * pixelSize, 0);
            ctx.lineTo(i * pixelSize, size * pixelSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * pixelSize);
            ctx.lineTo(size * pixelSize, i * pixelSize);
            ctx.stroke();
        }
    }, [size, pixelSize]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setDrawingAbility(true);
        handleDraw(e);
    };

    const handleMouseUp = () => {
        setDrawingAbility(false);
    };

    const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!DrawingAbility) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / pixelSize);
        const y = Math.floor((e.clientY - rect.top) / pixelSize);

        onDraw(x, y);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#212024';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#2C2D30';
        for (let i = 0; i <= size; i++) {
            ctx.beginPath();
            ctx.moveTo(i * pixelSize, 0);
            ctx.lineTo(i * pixelSize, size * pixelSize);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * pixelSize);
            ctx.lineTo(size * pixelSize, i * pixelSize);
            ctx.stroke();
        }
    };

    return {
        canvasRef,
        handleMouseDown,
        handleMouseUp,
        handleDraw,
        clearCanvas
    };
};
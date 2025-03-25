import {useRef, useEffect, useState} from 'react';

const PIXEL_SIZE = 10;
const SIZE = 50;

const Canvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [DrawingAbility, setDrawingAbility] = useState<boolean>(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#ddd';
        for (let i = 0; i <= SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * PIXEL_SIZE, 0);
            ctx.lineTo(i * PIXEL_SIZE, SIZE * PIXEL_SIZE);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * PIXEL_SIZE);
            ctx.lineTo(SIZE * PIXEL_SIZE, i * PIXEL_SIZE);
            ctx.stroke();
        }
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setDrawingAbility(true);
        draw(e);
    };

    const stopDrawing = () => {
        setDrawingAbility(false);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!DrawingAbility) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();

        const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE) * PIXEL_SIZE;
        const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE) * PIXEL_SIZE;

        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#ddd';
        for (let i = 0; i <= SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * PIXEL_SIZE, 0);
            ctx.lineTo(i * PIXEL_SIZE, SIZE * PIXEL_SIZE);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * PIXEL_SIZE);
            ctx.lineTo(SIZE * PIXEL_SIZE, i * PIXEL_SIZE);
            ctx.stroke();
        }
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={SIZE * PIXEL_SIZE}
                height={SIZE * PIXEL_SIZE}
                style={{border: '1px solid #000', cursor: 'crosshair'}}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onMouseMove={draw}
            />
            <button onClick={clearCanvas}>
                Стереть
            </button>
            <button>
                Распознать
            </button>
        </div>
    );
}

export default Canvas;
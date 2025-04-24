import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

export type Point = {
    id: number;
    x: number;
    y: number;
};

export interface GraphCanvasHandle {
    getPoints: () => Point[];
    clear: () => void;
    clearCanvas: () => void;
    addPoints: (newPoints: Point[]) => void;
    drawPath: (path: number[]) => void;
    animatePath: (path: number[]) => Promise<void>;
    animateHistory: (history: number[][]) => Promise<void>;
}

interface GraphCanvasProps {
    fullness: number;
}

const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(({ fullness }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const pointsRef = useRef<Point[]>([]);

    useEffect(() => {
        pointsRef.current = points;
        drawPoints();
    }, [points]);

    const RADIUS = 10;

    const drawPoints = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
            ctx.fillStyle = '#82D930FF';
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.stroke();

            ctx.fillStyle = 'white';
            ctx.font = '12px sans-serif';
            // ctx.fillText(`(${p.x.toFixed(0)}, ${p.y.toFixed(0)})`, p.x + 6, p.y - 6);
        }
    };

    useEffect(() => {
        drawPoints();
    }, [points]);

    const isInside = (x: number, y: number, point: Point) =>
        Math.hypot(point.x - x, point.y - y) < RADIUS;

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const existing = points.find(p => isInside(x, y, p));
        if (existing) {
            setPoints(prev => prev.filter(p => p.id !== existing.id));
        } else {
            const newPoint: Point = {
                id: Date.now(),
                x,
                y,
            };
            setPoints(prev => [...prev, newPoint]);
        }
    };

    useImperativeHandle(ref, () => ({
        getPoints: () => points,
        clear: () => {
            setPoints([]);
        },

        addPoints: (newPoints: Point[]) => {
            setPoints(prev => [...prev, ...newPoints]);
        },

        clearCanvas: () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPoints();
        },

        drawPath: (path: number[]) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            const currentPoints = pointsRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const first = currentPoints.find(p => p.id === path[0]);
            if (!first) return;

            ctx.beginPath();
            ctx.moveTo(first.x, first.y);
            for (let i = 1; i < path.length; i++) {
                const p = currentPoints.find(p => p.id === path[i]);
                if (p) ctx.lineTo(p.x, p.y);
            }

            ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();

            for (const p of currentPoints) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
                ctx.fillStyle = '#FFA500';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.stroke();
            }
        },

        animatePath: async (path: number[]) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            const currentPoints = pointsRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of currentPoints) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
                ctx.fillStyle = '#82D930FF';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.stroke();
            }

            const firstPoint = currentPoints.find(p => p.id === path[0]);
            if (!firstPoint) return;

            ctx.beginPath();
            ctx.moveTo(firstPoint.x, firstPoint.y);

            for (let i = 0; i < path.length; i++) {
                const point = currentPoints.find(p => p.id === path[i]);
                if (!point) continue;

                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(point.x, point.y, 7, 0, 2 * Math.PI);
                ctx.fillStyle = 'orange';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.stroke();

                if (i < path.length - 1) {
                    await new Promise(res => setTimeout(res, 150));
                }
            }

            if (path.length > 2) {
                ctx.lineTo(firstPoint.x, firstPoint.y);
                ctx.stroke();
            }
        },

        animateHistory: async (history: number[][]) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx || !history.length) return;

            const currentPoints = pointsRef.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of currentPoints) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
                ctx.fillStyle = '#82D930FF';
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.stroke();
            }

            for (const path of history) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (const p of currentPoints) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
                    ctx.fillStyle = '#82D930FF';
                    ctx.fill();
                    ctx.strokeStyle = '#333';
                    ctx.stroke();
                }

                const first = currentPoints.find(p => p.id === path[0]);
                if (!first) continue;

                ctx.beginPath();
                ctx.moveTo(first.x, first.y);
                for (let i = 1; i < path.length; i++) {
                    const p = currentPoints.find(p => p.id === path[i]);
                    if (p) ctx.lineTo(p.x, p.y);
                }
                ctx.lineTo(first.x, first.y);

                ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();

                for (const id of path) {
                    const p = currentPoints.find(p => p.id === id);
                    if (!p) continue;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
                    ctx.fillStyle = 'rgba(0, 100, 255, 0.7)';
                    ctx.fill();
                    ctx.strokeStyle = '#333';
                    ctx.stroke();
                }

                await new Promise(res => setTimeout(res, 300));
            }
        }
    }));

    return (
        <canvas
            ref={canvasRef}
            width={500}
            height={350}
            onClick={handleCanvasClick}
            style={{ border: '1px solid #ccc', background: '#212024', cursor: 'crosshair', borderRadius: '15px'}}
        />
    );
});

export default GraphCanvas;
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

const GraphCanvas = forwardRef<GraphCanvasHandle>((_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const pointsRef = useRef<Point[]>([]);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const RADIUS = 10;

    useEffect(() => {
        pointsRef.current = points;
        drawPoints();
    }, [points]);

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth * 0.5;
            const height = window.innerHeight * 0.5;
            setCanvasSize({ width, height });
        };
    
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        drawPoints();
    }, [points]);

    const drawPoints = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of points) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
            ctx.fillStyle = '#82D930';
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.stroke();
        }
    };

    

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
        }
        else {
            const newPoint: Point = {
                id: Date.now(),
                x,
                y,
            };
            setPoints(prev => [...prev, newPoint]);
        }
    };

    const calculateDistance = (p1: Point, p2: Point) => {
        return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    };

    const drawDistance = (ctx: CanvasRenderingContext2D, p1: Point, p2: Point) => {
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const distance = calculateDistance(p1, p2);
        ctx.fillStyle = 'white';
        ctx.font = '12px Tektur';
        ctx.textAlign = 'center';
        ctx.fillText(distance.toFixed(1), midX, midY - 10);
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
            ctx.strokeStyle = 'rgba(130,217,48, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            for (const p of currentPoints) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
                ctx.fillStyle = '#FFA500';
                ctx.fill();
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
            }
            const firstPoint = currentPoints.find(p => p.id === path[0]);
            if (!firstPoint) return;
            ctx.beginPath();
            ctx.moveTo(firstPoint.x, firstPoint.y);
            for (let i = 0; i < path.length; i++) {
                const point = currentPoints.find(p => p.id === path[i]);
                if (!point) continue;
                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = 'rgba(130,217,48, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
                if (i > 0) {
                    const prevPoint = currentPoints.find(p => p.id === path[i - 1]);
                    if (prevPoint) {
                        drawDistance(ctx, prevPoint, point);
                    }
                }
                ctx.beginPath();
                ctx.arc(point.x, point.y, 7, 0, 2 * Math.PI);
                ctx.fillStyle = '#82D930FF';
                ctx.fill(); 
                if (i < path.length - 1) {
                    await new Promise(res => setTimeout(res, 150));
                }
            }
            if (path.length > 2) {
                ctx.lineTo(firstPoint.x, firstPoint.y);
                ctx.stroke();
            }
            const lastPoint = currentPoints.find(p => p.id === path[path.length - 1]);
            if (lastPoint) {
                drawDistance(ctx, lastPoint, firstPoint);
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
            }
            for (const path of history) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (const p of currentPoints) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI);
                    ctx.fillStyle = '#82D930FF';
                    ctx.fill();
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
                    ctx.fillStyle = 'rgba(0, 100, 255, 0.5)';
                    ctx.fill();
                }
                await new Promise(res => setTimeout(res, 300));
            }
        }
    }));

    return (
        <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            style={{
                width: `${canvasSize.width}px`,
                height: `${canvasSize.height}px`,
                border: '2px solid #ccc',
                background: '#212024',
                cursor: 'crosshair',
                borderRadius: '10px'
            }}
        />
    );
});

export default GraphCanvas;
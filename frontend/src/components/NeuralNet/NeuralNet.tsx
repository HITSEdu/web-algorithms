import {useState, useEffect} from "react";
import {useCanvas} from "../../hooks/useCanvas";
import './NeuralNet.css'

const NeuralNet: React.FC = () => {
    const size = 50;
    const [pixelSize, setPixelSize] = useState(5);

    useEffect(() => {
        setPixelSize(Math.min(10, window.innerHeight / 100));
    }, [window.innerHeight]);

    const draw = (x: number, y: number) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    };

    const {canvasRef, handleMouseDown, handleMouseUp, handleDraw, clearCanvas} =
        useCanvas({size, pixelSize, onDraw: draw});


    return (
        <div className='canvas-container'>
            <canvas
                ref={canvasRef}
                width={size * pixelSize}
                height={size * pixelSize}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleDraw}
            />
            <div className='button-container'>
                <button className='button-clear' onClick={clearCanvas}>
                    Стереть
                </button>
                <button className='button-recognize'>
                    Распознать
                </button>
            </div>
        </div>
    );
}

export default NeuralNet;
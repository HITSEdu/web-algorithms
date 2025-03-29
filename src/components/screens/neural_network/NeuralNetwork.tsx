import {useCanvas} from "../../../hooks/useCanvas";
import './NeuralNetwork.css'
import {useResize} from "../../../hooks/useResize";

const NeuralNet: React.FC = () => {
    const size = 50;
    const pixelSize = useResize(200, 10);

    const draw = (x: number, y: number) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    };

    const {canvasRef, handleMouseDown, handleMouseUp, handleDraw, clearCanvas} =
        useCanvas({size, pixelSize, onDraw: draw});


    async function recognize(ctx: CanvasRenderingContext2D) {
        const response = await fetch('http://localhost:8000/recognize', {
                method: 'POST',
                body: JSON.stringify({ctx})
            }
        );

        console.log(response);
    }


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
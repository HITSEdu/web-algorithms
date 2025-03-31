import './NeuralNetwork.css'
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import {useState} from "react";

const NeuralNet: React.FC = () => {
    const pixelSize = Math.ceil(useResize(80, 30));

    const command = (value: number) => {
        return 1
    }

    const {grid, size, handleClick, sizeUp, sizeDown, setGrid} = useGrid(
        {
            initSize: 50,
            minSize: 50,
            maxSize: 50,
            command: command,
        });

    const [isDrawing, setIsDrawing] = useState(false);

    const handleMouseDown = (row: number, col: number) => {
        setIsDrawing(true);
        handleClick(row, col);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isDrawing) {
            handleClick(row, col);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    async function recognize() {
        try {
            const response = await fetch('http://localhost:8000/recognize', {
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({pixels: grid})
                }
            );

            if (!response.ok) {
                console.error('Не удалось загрузить картинку');
                return;
            }

            const data = await response.json();
            alert(data?.digit);
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }


    return (
        <div className='grid-container'
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
        >
            <Grid
                grid={grid}
                size={size}
                pixelSize={pixelSize}
                handleClick={handleMouseDown}
                handleMouseEnter={handleMouseEnter}
                style={{
                    margin: '0',
                    borderRadius: '24%',
                    border: '1px solid #2C2D30',
                }}
            />
            <div className='button-container'>
                <button className='button-recognize' onClick={() => recognize()}>
                    Распознать
                </button>
            </div>
        </div>
    );
}

export default NeuralNet;
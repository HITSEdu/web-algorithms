import './NeuralNetwork.css'
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import {useState} from "react";
import CommandButton from "../../controls/CommandButton";
import IconRecognize from "../../icons/IconRecognize";
import IconGenerate from "../../icons/IconGenerate";
import { log } from 'console';

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/neural_network"

const NeuralNet: React.FC = () => {
    const pixelSize = Math.ceil(useResize(45, 25, 12, 'min'));
    const iconSize = useResize(28, 25, 15);

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
    const [digit, setDigit] = useState(-1);

    const isCorrect = (row: number, col: number) => {
        return row >= 0 && row < 50 && col >= 0 && col < 50;
    }

    const handleMouseDown = (row: number, col: number) => {
        setIsDrawing(true);
        handleClick(row, col);

        if (isCorrect(row + 1, col)) handleClick(row + 1, col);
        if (isCorrect(row - 1, col)) handleClick(row - 1, col);
        if (isCorrect(row, col + 1)) handleClick(row, col + 1);
        if (isCorrect(row, col - 1)) handleClick(row, col - 1);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isDrawing) {
            handleClick(row, col);

            if (isCorrect(row + 1, col)) handleClick(row + 1, col);
            if (isCorrect(row - 1, col)) handleClick(row - 1, col);
            if (isCorrect(row, col + 1)) handleClick(row, col + 1);
            if (isCorrect(row, col - 1)) handleClick(row, col - 1);
        }
    };


    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        setGrid(prev => {
            return prev.map((row, rowIdx) =>
                row.map((col, colIdx) =>
                    prev[rowIdx][colIdx] = 0
                ));
        });
    }

    async function recognize() {
        try {
            const response = await fetch(`${API_URL}${PREFIX}/recognize`, {
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
            console.log(data);
            setDigit(data?.digit);
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
            <div className='digit-container'>
                <div className='div-digit'>
                </div>
                <p>{digit >= 0 ? digit : "Loading..."}</p>
                <div className='div-digit'>
                </div>
            </div>
            <div className='button-container'>
                <CommandButton commandName='Очистить' Icon={IconGenerate} onCommand={clearCanvas} iconSize={iconSize}/>
                <CommandButton commandName='Распознать' Icon={IconRecognize} onCommand={recognize} iconSize={iconSize}/>
            </div>
        </div>
    );
}

export default NeuralNet;
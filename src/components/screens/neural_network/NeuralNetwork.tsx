import './NeuralNetwork.css'
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import {useState} from "react";
import CommandButton from "../../controls/CommandButton";
import IconRecognize from "../../icons/IconRecognize";
import IconGenerate from "../../icons/IconGenerate";
import RadioButton from "../../radio_button/RadioButton";

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/neural_network"

const NeuralNet: React.FC = () => {
    const pixelSize = Math.ceil(useResize(45, 25, 12, 'min'));
    const iconSize = useResize(40, 30, 15);
    const [confidence, setConfidence] = useState([]);
    const [best, setBest] = useState(-1);
    const [cur, setCur] = useState(-1);

    const command = (value: number) => {
        return 13
    }

    const {grid, size, handleClick, sizeUp, sizeDown, setGrid} = useGrid(
        {
            initSize: 50,
            minSize: 50,
            maxSize: 50,
            command: command,
        });

    const [isDrawing, setIsDrawing] = useState(false);

    const isCorrect = (row: number, col: number) => {
        return row >= 0 && row < 50 && col >= 0 && col < 50;
    }

    const getCell = (e: React.TouchEvent) => {
        const gridElement = document.querySelector('.grid');
        if (!gridElement) return null;

        const rect = gridElement.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const col = Math.floor((x) / (pixelSize * 21 / size));
        const row = Math.floor((y) / (pixelSize * 21 / size));

        if (isCorrect(row, col)) {
            return {row, col};
        }

        return null;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);

        const cell = getCell(e);
        if (cell) handleMouseDown(cell.row, cell.col);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDrawing) return;

        const cell = getCell(e);
        if (cell) handleMouseEnter(cell.row, cell.col);
    }

    const handleTouchEnd = () => {
        handleMouseUp()
    };

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
                console.error('[Neural Network|recognize] response error: Failed to recognize');
                return;
            }

            const data = await response.json();
            setConfidence(data?.predict);
            setCur(data?.digit);
            setBest(data?.digit);
        } catch (error) {
            console.error('[Neural Network|recognize] response error: ', error);
        }
    }

    const handleChange = (value: string) => {
        const digit = Number(value);
        if (confidence.length === 0) {
            setCur(-1);
            return;
        }

        setCur(digit);
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
                handleTouchStart={handleTouchStart}
                handleTouchMove={handleTouchMove}
                handleTouchEnd={handleTouchEnd}
                style={{
                    margin: '0',
                    borderRadius: '24%',
                    border: '1px solid #2C2D30',
                }}
            />
            <div className='radio-container'>
                <RadioButton
                    options={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']}
                    best={best.toString()}
                    onChange={handleChange}
                    orientation='row'
                    bestColor='#CA50D9'
                />
            </div>
            <div className='digit-container'>
                <div className='div-digit'>
                </div>
                <p>{cur >= 0 && confidence[cur] !== undefined ? `${confidence[cur]}%` : "#@%"}</p>
                <div className='div-digit'>
                </div>
            </div>
            <div className='button-container'>
                <div className='generate-button'>
                    <CommandButton commandName='Очистить' Icon={IconGenerate} onCommand={clearCanvas}
                                   iconSize={iconSize}/>
                </div>
                <CommandButton commandName='Распознать' Icon={IconRecognize} onCommand={recognize} iconSize={iconSize}/>
            </div>
        </div>
    );
}

export default NeuralNet;
import './NeuralNetwork.css'
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import {useState} from "react";
import CommandButton from "../../controls/CommandButton";
import IconRecognize from "../../icons/IconRecognize";

const API_URL = process.env.REACT_APP_API_URL;

const NeuralNet: React.FC = () => {
    const pixelSize = Math.ceil(useResize(100, 30));
    const iconSize = useResize(75, 20);

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
            const response = await fetch(`${API_URL}/recognize`, {
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
            <CommandButton commandName='Распознать' Icon={IconRecognize} onCommand={recognize} iconSize={iconSize}/>
        </div>
    );
}

export default NeuralNet;
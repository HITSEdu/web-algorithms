import {useState} from "react";
import './AStar.css';
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import Controls from "../../controls/Controls";
import Info from "../../info/Info";

const API_URL = process.env.REACT_APP_API_URL;

const AStar: React.FC = () => {
    const pixelSize = Math.ceil(useResize(100, 15));
    const [fullness, setFullness] = useState(35);

    const command = (value: number) => {
        return (value + 1) % 4
    }

    const {grid, size, handleClick, sizeUp, sizeDown, setGrid} = useGrid(
        {
            initSize: 15,
            minSize: 5,
            maxSize: 25,
            command: command,
        });

    const fullnessUp = () => {
        setFullness(prevFullness => Math.min(prevFullness + 5, 100));
    }

    const fullnessDown = () => {
        setFullness(prevFullness => Math.max(prevFullness - 5, 0));
    }

    const generateGrid = async () => {
        try {
            const response = await fetch(`${API_URL}/generate?size=${size}&fullness=${fullness}`);

            if (!response.ok) {
                console.error('Не удалось сгенерировать!');
                return;
            }

            const generated = await response.json();
            setGrid(generated.grid);
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const findPath = async () => {
        try {
            const response = await fetch(`${API_URL}/find-path`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({pixels: grid})
                }
            );

            if (!response.ok) {
                console.error('Путь не найден!');
                return;
            }

            const data = await response.json();

            if (data?.path) {
                let index = 0;

                const interval = setInterval(() => {
                    if (index >= data.path.length) {
                        clearInterval(interval);
                        return;
                    }

                    const [row, col] = data.path[index];

                    setGrid(prev => {
                        const newGrid = prev.map(row => [...row]);
                        if (newGrid[row][col] !== 2 && newGrid[row][col] !== 3) {
                            newGrid[row][col] = 4;
                        }
                        return newGrid;
                    });

                    index++;
                }, 250);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const infoData = [
        {title: 'Начало', color: '#D92525'},
        {title: 'Конец', color: '#D98425'},
        {title: 'Путь', color: 'rgba(217, 132, 37, 0.3)'},
        {title: 'Стенки', color: '#FFFFFF'},
    ];

    return (
        <div className='grid-container'>
            <Grid
                grid={grid}
                size={size}
                pixelSize={pixelSize}
                handleClick={handleClick}
                flag={true}
            />

            <Info listOfClusters={infoData}/>

            <Controls
                size={size}
                sizeUp={sizeUp}
                sizeDown={sizeDown}
                onGenerate={generateGrid}
                onCommand={findPath}
                fullnessUp={fullnessUp}
                fullnessDown={fullnessDown}
                fullnes={fullness}
                commandName='Найти путь'
            />
        </div>
    );
};

export default AStar;
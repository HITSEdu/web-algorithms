import {useState, useRef} from "react";
import './Ant.css';
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import Controls from "../../controls/Controls";
import Info from "../../info/Info";
import { toast, ToastContainer, Slide } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/ant";

const Ant: React.FC = () => {
    const pixelSize = Math.ceil(useResize(45, 25, 12, 'min'));
    const [fullness, setFullness] = useState(20);
    const [nutritionalValue, setNutritionalValue] = useState(5);
    const [animation, setAnimation] = useState<boolean>(true);
    const animationRef = useRef(animation);

    const command = (value: number) => {
        stopAnimation();
        return (value + 1) % 4;
    }

    const stopAnimation = () => {
        setAnimation(false);
        animationRef.current = false;
    };

    const startAnimation = () => {
        setAnimation(true);
        animationRef.current = true;
    };

    const {grid, size, handleClick, sizeUp, sizeDown, setGrid} = useGrid({
        initSize: 15,
        minSize: 5,
        maxSize: 25,
        command: command,
    });

    const fullnessUp = () => {
        stopAnimation();
        setFullness(prev => Math.min(prev + 5, 100));
    }
    const fullnessDown = () => {
        stopAnimation();
        setFullness(prev => Math.max(prev - 5, 0));
    }

    const generateGrid = async () => {
        stopAnimation();
        try {
            const response = await fetch(`${API_URL}${PREFIX}/generate?size=${size}&fullness=${fullness}`);

            if (!response.ok) {
                console.error('[Ant|generate] response error: Failed to generate');
                return;
            }

            const data = await response.json();
            setGrid(data.grid);
        } catch (error) {
            console.error('[Ant|generate] response error:', error);
        }
    }

    const findPath = async () => {
        stopAnimation();
        startAnimation();

        try {
            const response = await fetch(`${API_URL}${PREFIX}/find-path`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({pixels: grid})
            });

            if (!response.ok) {
                console.error('[Ant|findPath] error: Couldn\'t find the path');
                return;
            }

            const data = await response.json();

            if (!data.path || data.path.length === 0) {
                toast.info('Нет пути ', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    theme: "dark",
                    transition: Slide,
                    style: {
                        width: '25vw',
                    },
                });
            }

            if (data?.path) {
                await animatePath(data.path);
            }

            if (data?.history) {
                await animateHistory(data.history);
            }

        } catch (error) {
            console.error('[Ant|findPath] response error:', error);
        }
    }

    const animatePath = async (path: number[][]) => {
        for (let i = 0; i < path.length; i++) {
            if (!animationRef.current) return;
            const [row, col] = path[i];

            setGrid(prev => {
                const newGrid = prev.map(r => [...r]);
                if (newGrid[row][col] !== 2 && newGrid[row][col] !== 3) {
                    newGrid[row][col] = 4;
                }
                return newGrid;
            });

            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    const animateHistory = async (history: number[][]) => {
        for (let i = 0; i < history.length; i++) {
            if (!animationRef.current) return;
            const [row, col] = history[i];

            setGrid(prev => {
                const newGrid = prev.map(r => [...r]);
                if (newGrid[row][col] !== 2 && newGrid[row][col] !== 3) {
                    newGrid[row][col] = 5;
                }
                return newGrid;
            });

            await new Promise(resolve => setTimeout(resolve, 30));
        }
    }

    const infoData = [
        {title: 'Колония', color: '#D98425'},
        {title: 'Источники', color: '#D92525'},
        {title: 'Путь', color: 'rgba(217, 132, 37, 0.6)'},
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
                fullness={fullness}
                commandName='Запуск'
            />
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                transition={Slide}
                />
        </div>
    );
};

export default Ant;
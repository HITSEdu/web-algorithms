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
    const [fullness, setFullness] = useState(5);
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
        initSize: 25,
        minSize: 5,
        maxSize: 50,
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
                    theme: "dark",
                    transition: Slide,
                    style: {
                        fontSize: 'max(1vw, 0.7rem)',
                        width: '30vw',
                    },
                });
            }
            if (data?.path) {
                await animatePath(data.path);
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
                    newGrid[row][col] = 8;
                }
                return newGrid;
            });
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    const infoData = [
        {title: 'Колония', color: '#D92525'},
        {title: 'Источники', color: '#9379FF'},
        {title: 'Путь', color: 'rgba(147, 121, 255, 0.3)'},
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
                algorithm="ant"
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
            <ToastContainer />
        </div>
    );
};

export default Ant;
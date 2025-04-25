import {useState, useRef} from "react";
import './Genetic.css';
import {useResize} from "../../../hooks/useResize";
import Info from "../../info/Info";
import GraphCanvas, { GraphCanvasHandle } from "../../graph_canvas/GraphCanvas";
import type { Point } from "../../graph_canvas/GraphCanvas";
import IconPath from "../../icons/IconPath";
import CommandButton from "../../controls/CommandButton";
import IconGenerate from "../../icons/IconGenerate";
import IconMinus from "../../icons/IconMinus";
import IconPlus from "../../icons/IconPlus";
import { toast, ToastContainer, Slide } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/genetic";

const Genetic: React.FC = () => {
    const canvasRef = useRef<GraphCanvasHandle>(null);
    const [animation, setAnimation] = useState<boolean>(true);
    const animationRef = useRef(animation);

    const [localSize, setLocalSize] = useState(5);

    const stopAnimation = () => {
        setAnimation(false);
        animationRef.current = false;
    };

    const numberPlus = () => {
        setLocalSize(prev => Math.min(prev + 1, 30));
    };

    const numberMinus = () => {
        setLocalSize(prev => Math.max(prev - 1, 2));
    };

    const generateGrid = async () => {
        try {
            const response = await fetch(`${API_URL}${PREFIX}/generate?count=${localSize}`, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const result = await response.json();
            const generatedPoints: Point[] = result.points;
            canvasRef.current?.clear();
            canvasRef.current?.addPoints(generatedPoints);
        } catch (error) {
            console.error('[Genetic|generateGrid] response error:', error);
        }
    };

    const findPath = async () => {
        const points = canvasRef.current?.getPoints();
        if (!points || points.length < 2) {
            toast.warn('Недостаточно точек', {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: false,
                theme: "dark",
                transition: Slide,
                style: {
                    fontSize: 'max(1vw, 0.7rem)',
                    width: '30vw',
                  },
                });
            return;
        }

        try {
            const response = await fetch(`${API_URL}${PREFIX}/solve`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ points }),
            });

            const result = await response.json();
            const bestPath: number[] = result.path;
            const history: number[][] = result.history;

            if (animationRef.current) {
                if (history && history.length > 0) {
                    await canvasRef.current?.animateHistory(history);
                }
                await canvasRef.current?.animatePath(bestPath);
            } else {
                canvasRef.current?.drawPath(bestPath);
            }
        } catch (error) {
            console.error('[Genetic|findPath] response error:', error);
        }
    };

    const infoData = [
        {title: 'Города', color: 'rgb(130,217,48)'},
        {title: 'Путь', color: 'rgb(130,217,48, 0.5)'},
    ];

    const iconSize = useResize(40, 30, 15, 'min');

    return (
        <div className='grid-container'>
            <GraphCanvas ref={canvasRef}/>
            <Info listOfClusters={infoData}/>
            <div className='buttons-group'>
                <div className='resize-container'>
                    <button className='button-down' onClick={numberMinus}>
                        <IconMinus size={iconSize}/>
                    </button>
                    <p>{localSize}</p>
                    <button className='button-up' onClick={numberPlus}>
                        <IconPlus size={iconSize}/>
                    </button>
                </div>
                <CommandButton commandName={"Очистка"} Icon={IconGenerate} onCommand={() => canvasRef.current?.clear()} iconSize={iconSize}/>
                <div className='generate-button'>
                    <CommandButton commandName='Сгенерировать' Icon={IconGenerate} onCommand={generateGrid}
                                   iconSize={iconSize}/>
                </div>
                <CommandButton commandName={"Запуск"} Icon={IconPath} onCommand={findPath} iconSize={iconSize}/>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Genetic;
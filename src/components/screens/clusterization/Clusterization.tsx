import {useState} from "react";
import './Clusterization.css';
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import Controls from "../../controls/Controls";
import Info from "../../info/Info";

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/clusterization";

const COLORS = new Map<number, string>([
    [10, '#3BACD9'],
    [11, '#82D930'],
    [12, '#9379FF'],
    [13, '#CA50D9'],
    [14, '#D98425'],
    [15, '#D9CF25'],
]);

const Clusterization: React.FC = () => {
    const pixelSize = Math.ceil(useResize(45, 25, 12, 'min'));
    const [fullness, setFullness] = useState(20);
    const [nClusters, setNClusters] = useState(2);

    const command = (value: number) => {
        return (value + 1) % 4
    }

    const {grid, size, handleClick, sizeUp, sizeDown, setGrid} = useGrid({
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
            const response = await fetch(`${API_URL}${PREFIX}/generate?size=${size}&fullness=${fullness}`);

            if (!response.ok) {
                console.error('[Clusterization|generate] response status:', response.status);
                return;
            }
            const generated = await response.json();
            setGrid(generated.grid);
        } catch (error) {
            console.error('[Clusterization|generate] response error:', error);
        }
    };

    const clusterize = async () => {
        try {
            const response = await fetch(`${API_URL}${PREFIX}/clusterize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({pixels: grid})
            });
            if (!response.ok) {
                console.error('[Clusterization|clusterize] response status:', response.status);
                return;
            }

            const data = await response.json();
            console.log(data);
            if (data.status === 1) {
                setNClusters(data.data.k);
                setGrid(data.data.canvas);
            } else {
                console.log(data.status);
            }
        } catch (error) {
            console.error('[Clusterization|clusterize] response error:', error);
        }
    };


    const colorKeys = Array.from(COLORS.keys());
    const colorCount = colorKeys.length;

    const infoData = [
        {title: 'Точка', color: '#FFFFFF'},
        {title: 'Центр', color: '#D92525'},
        ...Array.from({length: nClusters}, (_, i) => {
            const colorIndex = colorKeys[i % colorCount];
            return {
                title: `${i + 1}`,
                color: `${COLORS.get(colorIndex)}`
            };
        })
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
                onCommand={clusterize}
                fullnessUp={fullnessUp}
                fullnessDown={fullnessDown}
                fullness={fullness}
                commandName='Выполнить'
            />
        </div>
    );
};

export default Clusterization;
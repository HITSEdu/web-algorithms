import {useState} from "react";
import './Clusterization.css';
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import Controls from "../../controls/Controls";
import Info from "../../info/Info";
import RadioButton from "../../radio_button/RadioButton";

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/clusterization";

type ClusterData = {
    [key: string]: {
        k: number;
        canvas: number[][];
        c: number;
    };
};

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
    const [best, setBest] = useState("2");
    const [options, setOptions] = useState(["2", "3", "4", "5", "6"]);
    const [clusterData, setClusterData] = useState<ClusterData | null>(null);

    const command = (value: number) => (value + 1) % 4;

    const fullnessUp = () => setFullness(prev => Math.min(prev + 5, 100));
    const fullnessDown = () => setFullness(prev => Math.max(prev - 5, 0));

    const {grid, size, handleClick, sizeUp, sizeDown, setGrid} = useGrid({
        initSize: 15,
        minSize: 5,
        maxSize: 25,
        command: command,
    });

    const findBest = (data: ClusterData) => {
        let bestKey: string | null = null;
        let maxCValue = -Infinity;
        for (let key of Object.keys(data)) {
            const cValue = data[key].c;
            if (cValue > maxCValue) {
                maxCValue = cValue;
                bestKey = key;
            }
        }
        return String(bestKey);
    };

    const generateGrid = async () => {
        try {
            const response = await fetch(`${API_URL}${PREFIX}/generate?size=${size}&fullness=${fullness}`);
            if (!response.ok) {
                console.error('[Clusterization|generate] response status:', response.status);
                return;
            }
            const generated = await response.json();
            setGrid(generated.grid);
            setNClusters(2);
            setClusterData(null);
            setBest("2");
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
            // console.log(data);
            if (data.status === 1) {
                const clusterData: ClusterData = data.data;
                const keys = Object.keys(clusterData);
                const best = findBest(clusterData);
                setOptions(keys);
                setBest(best);
                setNClusters(keys.length);
                setClusterData(clusterData);
                setGrid(clusterData[best].canvas);
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
                color: COLORS.get(colorIndex) || '#000000',
            };
        })
    ];

    return (
        <div className='grid-container'>
            <div className="grid-row">
                <Grid
                    grid={grid}
                    size={size}
                    pixelSize={pixelSize}
                    handleClick={handleClick}
                    flag={true}
                />
                <RadioButton
                    options={options}
                    best={best}
                    onChange={(value) => {
                        if (clusterData) {
                            const key = String(value);
                            if (clusterData[key]) {
                                setGrid(clusterData[key].canvas);
                            }
                            setNClusters(clusterData[key].k);
                        }
                    }}
                />
            </div>
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

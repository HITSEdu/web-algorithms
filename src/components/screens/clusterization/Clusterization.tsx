import {useState} from "react";
import './Clusterization.css';
import {useResize} from "../../../hooks/useResize";
import {useGrid} from "../../../hooks/useGrid";
import Grid from "../../grid/Grid";
import Controls from "../../controls/Controls";
import Info from "../../info/Info";
import RadioButton from "../../radio_button/RadioButton";
import { toast, ToastContainer, Slide } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/clusterization";

type ClusterItem = {
    k: number;
    canvas: number[][];
    c: number;
};

type ClusterData = {
    [type: string]: ClusterItem[];
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
    const [fullness, setFullness] = useState(10);
    const [nClusters, setNClusters] = useState(2);

    const [best, setBest] = useState("2");
    const [options, setOptions] = useState(["2", "3", "4", "5", "6"]);
    const [clusterData, setClusterData] = useState<ClusterData | null>(null);
    const [hideRadioButton, setHideRadioButton] = useState(false);

    const [algorithmTypes, setAlgorithmTypes] = useState(["k-means", "DBSCAN"]);
    const [currentAlgorithm, setCurrentAlgorithm] = useState(algorithmTypes[0]);

    const onGridTouch = (value: number) => (value + 1) % 2;

    const fullnessUp = () => setFullness(prev => Math.min(prev + 5, 100));
    const fullnessDown = () => setFullness(prev => Math.max(prev - 5, 0));

    const {grid, size, handleClick, sizeUp, sizeDown, setGrid} = useGrid({
        initSize: 15,
        minSize: 5,
        maxSize: 25,
        command: onGridTouch,
    });

    const findBest = (data: ClusterData) => {
        const kMeans = data["k-means"];
        let bestIndex = 0;
        let maxCValue = -Infinity;
        for (let i = 0; i < kMeans.length; i++) {
            const cValue = kMeans[i].c;
            if (cValue > maxCValue) {
                maxCValue = cValue;
                bestIndex = i;
            }
        }
        return bestIndex;
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
            setCurrentAlgorithm(algorithmTypes[0]);
            setHideRadioButton(false);
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
                setClusterData(clusterData);
                setAlgorithmTypes(Object.keys(clusterData));
                setCurrentAlgorithm(algorithmTypes[0]);

                const keys = Object.values(clusterData['k-means']);
                const options = Array.from({ length: keys.length }, (_, i) => String(i + 2));
                setOptions(options);

                const best = findBest(clusterData);
                setBest(String(clusterData["k-means"][best].k));
                setNClusters(clusterData["k-means"][best].k);
                
                setGrid(clusterData['k-means'][best].canvas);
                setHideRadioButton(false);
            } else {
                toast.warn('Нельзя выполнить кластеризацию!', {
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
        } catch (error) {
            console.error('[Clusterization|clusterize] response error:', error);
        }
    };

    const colorKeys = Array.from(COLORS.keys());
    const colorCount = colorKeys.length;

    let titleRed = (currentAlgorithm === algorithmTypes[1]) ? 'Шум' : 'Центр';

    const infoData = [
        {title: 'Точка', color: '#FFFFFF'},
        {title: titleRed, color: '#D92525'},
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
                {!hideRadioButton && (
                    <RadioButton
                        options={options}
                        best={best}
                        onChange={(value) => {
                            if (clusterData) {
                                const item = clusterData["k-means"][Number(value) - 2];
                                if (item) {
                                    setGrid(item.canvas);
                                    setNClusters(item.k);
                                }
                            }
                        }}
                        orientation="column"
                    />
                )}
            </div>
            <RadioButton
                    options={algorithmTypes}
                    best={currentAlgorithm}
                    onChange={(value) => {
                        setCurrentAlgorithm(value);
                        if (value === "k-means") {
                            setHideRadioButton(false);
                            setBest(best);
                        }
                        else {
                            setHideRadioButton(true);
                        }
                        if (clusterData) {
                            const item = clusterData[value][0];
                                if (item) {
                                    setGrid(item.canvas);
                                    setNClusters(item.k);
                                }
                        }
                    }}
                    orientation='row'
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

export default Clusterization;

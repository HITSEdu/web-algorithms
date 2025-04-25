import {useState, useEffect, useRef} from "react";
import ReactTree from 'react-d3-tree';
import {useResize} from "../../../hooks/useResize";
import './Tree.css';
import CommandButton from "../../controls/CommandButton";
import IconGenerate from "../../icons/IconGenerate";
import IconRecognize from "../../icons/IconRecognize";

const API_URL = process.env.REACT_APP_API_URL;
const PREFIX = "/tree";

type TreeNode = {
    name: string;
    children?: TreeNode[];
    type: string;
    question?: string;
    answer?: string;
};

const Tree: React.FC = () => {
    const [session, setSession] = useState("");
    const [csvText, setCsvText] = useState("");
    const [treeData, setTreeData] = useState<TreeNode | null>(null);

    const [classificationPath, setClassificationPath] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    const iconSize = useResize(40, 30, 15);
    const zoomSize = useResize(2500, 1, 0.1, 'width');

    const [animation, setAnimation] = useState(false);
    const animationRef = useRef(false);

    const stopAnimation = () => {
        setAnimation(false);
        animationRef.current = false;
    };

    const startAnimation = () => {
        setAnimation(true);
        animationRef.current = true;
    };

    useEffect(() => {
        const savedSession = localStorage.getItem("session");
        if (!savedSession) {
            const newSession = Date.now().toString();
            localStorage.setItem("session", newSession);
            setSession(newSession);
        } else {
            setSession(savedSession);
        }

        const savedTree = localStorage.getItem("treeData") || "";
        const savedCSV = localStorage.getItem("csvText") || "";

        setTreeData(savedTree ? JSON.parse(savedTree) : null);
        setCsvText(savedCSV);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCsvText(event.target.value);
        localStorage.setItem("csvText", event.target.value);
    }

    const buildTree = async (csvText: string) => {
        stopAnimation();

        try {
            const response = await fetch(`${API_URL}${PREFIX}/build`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    csv_text: csvText,
                    session_id: session,
                }),
            })

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Ошибка построения дерева:", errorMessage);
                return;
            }

            const data = await response.json();
            setTreeData(data.tree);

            localStorage.setItem("treeData", JSON.stringify(data.tree));

        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    }

    const animateAllClassifications = async (paths: any[][]) => {
        startAnimation();

        for (let i = 0; i < paths.length; i++) {
            if (!animationRef.current) return;

            const path = paths[i];

            setClassificationPath(path);

            for (let j = 0; j < path.length; j++) {
                if (!animationRef.current) return;
                setCurrentStep(j);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        stopAnimation();
    };

    const classifyTree = async (csvText: string) => {
        stopAnimation();

        try {
            const response = await fetch(`${API_URL}${PREFIX}/classify`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    csv_text: csvText,
                    session_id: session,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Ошибка классификации:", errorMessage);
                return;
            }

            const data = await response.json();
            const allPaths = data.results.map((res: any) => res.path);

            setClassificationPath([]);
            setCurrentStep(0);

            await animateAllClassifications(allPaths);

        } catch (error) {
            console.error("Ошибка при запросе классификации:", error);
        }
    };

    const transformTreeData = (node: any): TreeNode => {
        if (node.type === 'leaf') {
            return {
                name: node.value,
                type: node.type,
            };
        }

        const trueBranch = transformTreeData(node.true_branch);
        const falseBranch = transformTreeData(node.false_branch);

        return {
            name: `${node.question}?`,
            children: [
                {...trueBranch, answer: "Да"},
                {...falseBranch, answer: "Нет"},
            ],
            type: node.type,
        };
    };

    const renderCustomNodeElement = ({nodeDatum}: any) => {
        const isActive =
            classificationPath[currentStep]?.name === nodeDatum.name.replace(/\?$/, '');
        console.log("active path step:", classificationPath[currentStep]?.name);
        console.log("current node:", nodeDatum.name);

        return (
            <g>
                <text
                    x="0"
                    y="-35"
                    style={{
                        fontSize: "5rem",
                        textAnchor: "middle",
                        fontFamily: "inherit",
                        fill: isActive ? "#FFD700" : "#D1D1D1",
                    }}
                >
                    {nodeDatum.name}
                </text>
                <circle
                    r="25"
                    fill={nodeDatum.answer === "Нет" ? "red" : "green"}
                    stroke={isActive ? "#FFD700" : "none"}
                    strokeWidth={isActive ? 5 : 0}
                />
            </g>
        );
    };

    return (
        <div className="grid-container">
            <div className='tree-container'>
                {treeData ? (
                    <ReactTree
                        data={transformTreeData(treeData)}
                        orientation='vertical'
                        renderCustomNodeElement={renderCustomNodeElement}
                        separation={{siblings: 5, nonSiblings: 5}}
                        translate={{x: window.innerWidth / 2.4, y: window.innerHeight / 6}}
                        zoom={zoomSize}
                    />
                ) : (
                    <p>Загружается дерево...</p>
                )}
            </div>
            <div className='change-container'>
            <textarea
                className='tree-textarea'
                placeholder="Вставьте CSV данные..."
                value={csvText}
                onChange={handleChange}
            />
                <div className='button-container'>
                    <div className='generate-button'>
                        <CommandButton onCommand={() => buildTree(csvText)} Icon={IconGenerate} commandName="Построить"
                                       iconSize={iconSize}/>
                    </div>
                    <CommandButton onCommand={() => classifyTree(csvText)} Icon={IconRecognize} iconSize={iconSize}
                                   commandName="Определить"/>
                </div>
            </div>
        </div>
    );
};

export default Tree;

import './Info.css'
import IconInfo from "../icons/IconInfo";
import {useResize} from "../../hooks/useResize";

type Cluster = {
    title: string;
    color: string;
    opacity?: number;
}

interface InfoProps {
    listOfClusters: Cluster[];
}

const Info: React.FC<InfoProps> = ({listOfClusters}) => {
    const size = useResize(15, 30, 25, 'min');
    return (
        <div className="info-container">
            <IconInfo size={size}/>
            <div className="info-grid">
                {listOfClusters.map((elem, index) => (
                    <div key={index} className="info-cluster">
                        <div className="info-cluster-icon"
                             style={{backgroundColor: elem.color, opacity: elem?.opacity}}/>
                        <div className="info-cluster-text">
                            <p>{elem.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Info;
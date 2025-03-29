import './Info.css'
import IconInfo from "../svg/IconInfo";
import {useResize} from "../../hooks/useResize";

type Cluster = {
    title: string;
    color: string;
}

interface InfoProps {
    listOfClusters: Cluster[];
}

const Info: React.FC<InfoProps> = ({listOfClusters}) => {
    const size = useResize(70, 45);
    return (
        <div className="info-container">
            <IconInfo size={size}/>
            {listOfClusters.map((elem, index) => (
                <div key={index} className="info-cluster">
                    <div className="info-cluster-icon" style={{backgroundColor: elem.color}}/>
                    <div className="info-cluster-text">
                        <p>{elem.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Info;
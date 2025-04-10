import './Header.css'
import AStarIcon from "../icons/AStarIcon";
import ClusterIcon from "../icons/ClusterIcon";
import GeneticsIcon from "../icons/GeneticsIcon";
import HomeIcon from "../icons/HomeIcon";
import AntsIcon from "../icons/AntsIcon";
import TreeIcon from "../icons/TreeIcon";
import NeuralIcon from "../icons/NeuralIcon";
import ChangeThemeIcon from "../icons/ChangeThemeIcon";
import {useResize} from "../../hooks/useResize";

interface HeaderProps {
    page: string;
    title: string;
}

const Header: React.FC<HeaderProps> = ({page, title}) => {
    const size = useResize(10, 100, 20, 'min');
    const fontSize = useResize(21, 50, 10, 'min');

    return (
        <header className='header'>
            <div className='header-svg'>
                {page === 'home' && (<HomeIcon size={size}/>)}
                {page === 'A*' && (<AStarIcon size={size}/>)}
                {page === 'cluster' && (<ClusterIcon size={size}/>)}
                {page === 'genetics' && (<GeneticsIcon size={size}/>)}
                {page === 'ants' && (<AntsIcon size={size}/>)}
                {page === 'tree' && (<TreeIcon size={size}/>)}
                {page === 'neural' && (<NeuralIcon size={size}/>)}
            </div>
            <h1 className='header-h1' style={{ fontSize }}>
                {title}
            </h1>
            <div className='header-svg'>
                <ChangeThemeIcon size={size}/>
            </div>

        </header>
    );
};

export default Header;
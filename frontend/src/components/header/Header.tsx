import './Header.css'
import AStarIcon from "../svg/AStarIcon";
import ClusterIcon from "../svg/ClusterIcon";
import GeneticsIcon from "../svg/GeneticsIcon";
import HomeIcon from "../svg/HomeIcon";
import AntsIcon from "../svg/AntsIcon";
import TreeIcon from "../svg/TreeIcon";
import NeuralIcon from "../svg/NeuralIcon";
import ChangeThemeIcon from "../svg/ChangeThemeIcon";
import {useResize} from "../../hooks/useResize";

interface HeaderProps {
    page: string;
    title: string;
}

const Header: React.FC<HeaderProps> = ({page, title}) => {
    const size = useResize(12, 100);

    return (
        <header className='header'>
            <div className='header-svg'>
                {page === 'A*' && (<AStarIcon size={size}/>)}
                {page === 'cluster' && (<ClusterIcon size={size}/>)}
                {page === 'genetics' && (<GeneticsIcon size={size}/>)}
                {page === 'home' && (<HomeIcon size={size}/>)}
                {page === 'ants' && (<AntsIcon size={size}/>)}
                {page === 'tree' && (<TreeIcon size={size}/>)}
                {page === 'neural' && (<NeuralIcon size={size}/>)}
            </div>
            <h1 className='header-h1'>
                {title}
            </h1>
            <div className='header-svg'>
                <ChangeThemeIcon size={size}/>
            </div>

        </header>
    );
};

export default Header;
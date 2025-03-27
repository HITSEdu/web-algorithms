import './Home.css'
import AStarSection from "../svg/AStarSection";
import GeneticsSection from "../svg/GeneticsSection";
import ClusterSection from "../svg/ClusterSection";
import AntsSection from "../svg/AntsSection";
import TreeSection from "../svg/TreeSection";
import NeuralSection from "../svg/NeuralSection";
import {useResize} from "../../hooks/useResize";

interface HomeProps {
    onPageChange: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({onPageChange}) => {
    const size = useResize(20, 65);

    return (
        <div className='home-container'>
            <section className='home-section' onClick={(): void => onPageChange('A*')}>
                <AStarSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('cluster')}>
                <ClusterSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('genetics')}>
                <GeneticsSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('ants')}>
                <AntsSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('tree')}>
                <TreeSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('neural')}>
                <NeuralSection size={size}/>
            </section>
        </div>
    );
};

export default Home;
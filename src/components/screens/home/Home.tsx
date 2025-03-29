import './Home.css'
import AStarSection from "../../icons/AStarSection";
import GeneticsSection from "../../icons/GeneticsSection";
import ClusterSection from "../../icons/ClusterSection";
import AntsSection from "../../icons/AntsSection";
import TreeSection from "../../icons/TreeSection";
import NeuralSection from "../../icons/NeuralSection";
import {useResize} from "../../../hooks/useResize";

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
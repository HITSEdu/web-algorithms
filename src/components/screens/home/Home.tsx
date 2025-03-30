import './Home.css'
import AStarSection from "../../icons/AStarSection";
import GeneticsSection from "../../icons/GeneticsSection";
import ClusterSection from "../../icons/ClusterSection";
import AntsSection from "../../icons/AntsSection";
import TreeSection from "../../icons/TreeSection";
import NeuralSection from "../../icons/NeuralSection";
import {useResize} from "../../../hooks/useResize";

interface HomeProps {
    onPageChange: (page: string, title: string) => void;
}

const Home: React.FC<HomeProps> = ({onPageChange}) => {
    const size = useResize(20, 65);

    return (
        <div className='home-container'>
            <section className='home-section' onClick={(): void => onPageChange('A*', 'A* алгоритм')}>
                <AStarSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('cluster', 'Алгоритм кластеризации')}>
                <ClusterSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('genetics', 'Генетический алгоритм')}>
                <GeneticsSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('ants', 'Муравьиный алгоритм')}>
                <AntsSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('tree', 'Дерево решений')}>
                <TreeSection size={size}/>
            </section>
            <section className='home-section' onClick={(): void => onPageChange('neural', 'Нейронная сеть')}>
                <NeuralSection size={size}/>
            </section>
        </div>
    );
};

export default Home;
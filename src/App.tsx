import {useState} from 'react';
import './App.css';
import NeuralNet from "./components/screens/neural_network/NeuralNetwork";
import Header from "./components/header/Header";
import Home from "./components/screens/home/Home";
import Footer from "./components/footer/Footer";
import Navigation from "./components/navigation/Navigation";
import LeftPointer from "./components/pointers/LeftPointer";
import RightPointer from "./components/pointers/RightPointer";
import AStar from "./components/screens/a_star/AStar";
import Clusterization from './components/screens/clusterization/Clusterization';

const App: React.FC = () => {
    const [page, setPage] = useState('home');
    const [title, setTitle] = useState('Приближенные вычисления');

    const handlePageChange = (page: string, title?: string) => {
        setPage(page);
        if (title) {
            setTitle(title);
        }
    }

    return (
        <div className="app-container">
            <div className="content">
                <Header page={page} title={title}/>
                {page !== 'home' && <Navigation onPageChange={handlePageChange} page={page}/>}
                <div className="main-content">
                    <LeftPointer page={page} onPageChange={handlePageChange}/>
                    {page === 'home' && <Home onPageChange={handlePageChange}/>}
                    {page === 'cluster' && <Clusterization/>}
                    {page === 'A*' && <AStar/>}
                    {page === 'neural' && <NeuralNet/>}
                    <RightPointer page={page} onPageChange={handlePageChange}/>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default App;

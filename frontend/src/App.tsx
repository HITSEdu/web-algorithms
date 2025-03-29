import {useState} from 'react';
import './App.css';
import NeuralNet from "./components/neuralNet/NeuralNet";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import Navigation from "./components/navigation/Navigation";
import LeftPointer from "./components/Pointers/LeftPointer";
import RightPointer from "./components/Pointers/RightPointer";
import AStar from "./components/aStar/AStar";

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

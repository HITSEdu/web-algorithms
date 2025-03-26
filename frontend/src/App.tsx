import {useState} from 'react';
import './App.css';
import Canvas from "./components/canvas/Canvas";
import Header from "./components/header/Header";
import Home from "./components/home/Home";

const App: React.FC = () => {
    const [page, setPage] = useState('home');

    const handlePageChange = (page: string) => {
        setPage(page);
    }

    return (
        <div className="App">
            <Header onPageChange={handlePageChange} page={page} />
            {page === 'home' && <Home />}
            {page === 'neuron' && <Canvas />}
        </div>
    );
}

export default App;

import { useState } from "react";
import './Header.css'

const Header: React.FC = () => {
    const [alghNumber, setAlghNumber] = useState<number>(4);

    return (
        <header>
            <nav className="App-header">
                <ul className="App-header-list">
                    <li className="nav-item">
                        <button>A*</button>
                    </li>
                    <li className="nav-item">
                        <button>Алгоритм кластеризации</button>
                    </li>
                    <li className="nav-item">
                        <button>Генетический алгоритм</button>
                    </li>
                    <li className="nav-item">
                        <button>Главная</button>
                    </li>
                    <li className="nav-item">
                        <button>Муравьиный алгоритм</button>
                    </li>
                    <li className="nav-item">
                        <button>Дерево решений</button>
                    </li>
                    <li className="nav-item">
                        <button>Нейронные сети</button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
import './Header.css'

interface HeaderProps {
    onPageChange: (page: string) => void;
    page: string;
}

const Header: React.FC<HeaderProps> = ({onPageChange, page}) => {
    return (
        <header>
            <nav className="App-header">
                <ul className="App-header-list">
                    <li className="nav-item">
                        <button className={page === 'A*' ? 'active' : ''} onClick={() => onPageChange('A*')}>
                            A*
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={page === 'cluster' ? 'active' : ''} onClick={() => onPageChange('cluster')}>
                            Алгоритм кластеризации
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={page === 'genetics' ? 'active' : ''}
                                onClick={() => onPageChange('genetics')}>
                            Генетический алгоритм
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={page === 'home' ? 'active' : ''} onClick={() => onPageChange('home')}>
                            Главная
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={page === 'ants' ? 'active' : ''} onClick={() => onPageChange('ants')}>
                            Муравьиный алгоритм
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={page === 'tree' ? 'active' : ''} onClick={() => onPageChange('tree')}>
                            Дерево решений
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={page === 'neuron' ? 'active' : ''} onClick={() => onPageChange('neuron')}>
                            Нейронные сети
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
import './Navigation.css'

interface NavigationProps {
    onPageChange: (page: string, title: string) => void;
    page: string;
}

const Navigation: React.FC<NavigationProps> = ({onPageChange, page}: NavigationProps) => {
    return (
        <nav className="nav">
            <ul className="nav-list">
                <li className="nav-item">
                    <button className={page === 'home' ? 'active' : ''}
                            onClick={() => onPageChange('home', 'Приближенные вычисления')}>
                        Главная
                    </button>
                </li>
                <li className="nav-item">
                    <button className={page === 'A*' ? 'active' : ''}
                            onClick={() => onPageChange('A*', 'A* алгоритм')}>
                        A* алгоритм
                    </button>
                </li>
                <li className="nav-item">
                    <button className={page === 'cluster' ? 'active' : ''}
                            onClick={() => onPageChange('cluster', 'Алгоритм кластеризации')}>
                        Алгоритм кластеризации
                    </button>
                </li>
                <li className="nav-item">
                    <button className={page === 'genetics' ? 'active' : ''}
                            onClick={() => onPageChange('genetics', 'Генетический алгоритм')}>
                        Генетический алгоритм
                    </button>
                </li>
                <li className="nav-item">
                    <button className={page === 'ants' ? 'active' : ''}
                            onClick={() => onPageChange('ants', 'Муравьиный алгоритм')}>
                        Муравьиный алгоритм
                    </button>
                </li>
                <li className="nav-item">
                    <button className={page === 'tree' ? 'active' : ''}
                            onClick={() => onPageChange('tree', 'Дерево решений')}>
                        Дерево решений
                    </button>
                </li>
                <li className="nav-item">
                    <button className={page === 'neural' ? 'active' : ''}
                            onClick={() => onPageChange('neural', 'Нейронная сеть')}>
                        Нейронные сети
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
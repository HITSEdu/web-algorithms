interface UsePointerProps {
    page: string;
    direction: string;
}

export const usePointer = ({page, direction}: UsePointerProps) => {
    const changePageToRight = (page: string) => {
        switch (page) {
            case 'A*':
                return ('cluster');
            case 'cluster':
                return ('genetics');
            case 'genetics':
                return ('ants');
            case 'home':
                return ('A*');
            case 'ants':
                return ('tree');
            case 'tree':
                return ('neural');
            case 'neural':
                return ('home');
            default:
                return ('home');
        }
    }

    const changePageToLeft = (page: string) => {
        switch (page) {
            case 'A*':
                return ('home');
            case 'cluster':
                return ('A*');
            case 'genetics':
                return ('cluster');
            case 'home':
                return ('neural');
            case 'ants':
                return ('genetics');
            case 'tree':
                return ('ants');
            case 'neural':
                return ('tree');
            default:
                return ('home');
        }
    }

    const getNextPage = (page: string, direction: string) => {
        return (direction === 'left') ? changePageToLeft(page) : changePageToRight(page);
    }

    const titleData = {
        'A*': 'A* алгоритм',
        'home': 'Приближенные вычисления',
        'cluster': 'Алгоритм кластеризации',
        'genetics': 'Генетический алгоритм',
        'ants': 'Муравьиный алгоритм',
        'tree': 'Дерево решений',
        'neural': 'Нейронная сеть'
    }

    const result = getNextPage(page, direction);

    return {
        page: result,
        title: titleData[result]
    };
}
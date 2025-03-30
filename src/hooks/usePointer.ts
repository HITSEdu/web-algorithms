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
                return ('home');
            case 'home':
                return ('ants');
            case 'ants':
                return ('tree');
            case 'tree':
                return ('neural');
            case 'neural':
                return ('A*');
            default:
                return ('home');
        }
    }

    const changePageToLeft = (page: string) => {
        switch (page) {
            case 'A*':
                return ('neural');
            case 'cluster':
                return ('A*');
            case 'genetics':
                return ('cluster');
            case 'home':
                return ('genetics');
            case 'ants':
                return ('home');
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
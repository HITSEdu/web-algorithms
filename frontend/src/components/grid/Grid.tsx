import './Grid.css'

interface GridProps {
    grid: number[][];
    size: number;
    pixelSize: number;
    handleClick: (row: number, cell: number) => void;
}

const Grid: React.FC<GridProps> = ({grid, size, pixelSize, handleClick}) => {

    return (
        <div className="grid"
             style={{
                 gridTemplateColumns: `repeat(${size}, ${pixelSize}px)`,
                 gridTemplateRows: `repeat(${size}, ${pixelSize}px)`
             }}>
            {grid.map((row, rowIndex) => (
                row.map((cell, cellIndex) => (
                    <div
                        key={`${rowIndex}-${cellIndex}`}
                        className={`cell-${cell}`}
                        onClick={() => handleClick(rowIndex, cellIndex)}
                    />
                ))
            ))}
        </div>
    );
};

export default Grid;
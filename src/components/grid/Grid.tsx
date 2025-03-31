import './Grid.css'

interface GridProps {
    grid: number[][];
    size: number;
    pixelSize: number;
    handleClick: (row: number, cell: number) => void;
    handleMouseEnter?: (row: number, cell: number) => void;
    style?: React.CSSProperties;
}

const Grid: React.FC<GridProps> = ({grid, size, pixelSize, handleClick, handleMouseEnter, style}) => {

    pixelSize = pixelSize * 21 / size;

    return (
        <div className="grid"
             style={{
                 gridTemplateColumns: `repeat(${size}, ${pixelSize}px)`,
                 gridTemplateRows: `repeat(${size}, ${pixelSize}px)`
             }}>
            {grid.map((row, rowIndex) => (
                row.map((cell, cellIndex) => (
                    <div
                        style={{...style}}
                        key={`${rowIndex}-${cellIndex}`}
                        className={`cell-${cell}`}
                        onMouseDown={() => handleClick(rowIndex, cellIndex)}
                        onMouseEnter={handleMouseEnter ? () => handleMouseEnter(rowIndex, cellIndex) : undefined}
                    />
                ))
            ))}
        </div>
    );
};

export default Grid;
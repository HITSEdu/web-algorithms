import './Grid.css'

interface GridProps {
    grid: number[][];
    size: number;
    pixelSize: number;
    handleClick: (row: number, cell: number, flag?: boolean) => void;
    handleMouseEnter?: (row: number, cell: number) => void;
    style?: React.CSSProperties;
    flag?: boolean;
    handleTouchStart?: (e: React.TouchEvent) => void;
    handleTouchMove?: (e: React.TouchEvent) => void;
    handleTouchEnd?: (e: React.TouchEvent) => void;
}

const Grid: React.FC<GridProps> = ({
                                       grid, size, pixelSize, handleClick, handleMouseEnter,
                                       style, flag, handleTouchStart, handleTouchMove, handleTouchEnd
                                   }) => {

    pixelSize = pixelSize * 21 / size;

    return (
        <div className="grid"
             style={{
                 gridTemplateColumns: `repeat(${size}, ${pixelSize}px)`,
                 gridTemplateRows: `repeat(${size}, ${pixelSize}px)`,
                 touchAction: 'none',
             }}
             onTouchStart={handleTouchStart ? handleTouchStart : undefined}
             onTouchMove={handleTouchMove ? handleTouchMove : undefined}
             onTouchEnd={handleTouchEnd ? handleTouchEnd : undefined}
        >
            {grid.map((row, rowIndex) => (
                row.map((cell, cellIndex) => (
                    <div
                        style={{...style}}
                        key={`${rowIndex}-${cellIndex}`}
                        className={`cell-${cell}`}
                        onMouseDown={() => handleClick(rowIndex, cellIndex, flag)}
                        onMouseEnter={handleMouseEnter ? () => handleMouseEnter(rowIndex, cellIndex) : undefined}
                    />
                ))
            ))}
        </div>
    );
};

export default Grid;
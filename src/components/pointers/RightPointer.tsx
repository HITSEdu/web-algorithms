import {usePointer} from "../../hooks/usePointer";
import './Pointer.css'
import {useResize} from "../../hooks/useResize";

interface RightPointerProps {
    page: string;
    onPageChange: (page: string, title: string) => void;
}

const RightPointer: React.FC<RightPointerProps> = ({page, onPageChange}) => {
    const newPage = usePointer({page, direction: 'right'})
    const size = useResize(20, 50, 10, 'min');

    return (
        <div style={{width: `${size * 1.77}px`, height: `${size * 3 * 1.77}px`}}
             className='RightPointer' onClick={() => onPageChange(newPage.page, newPage.title)}>
            <svg width={size} height={size * 1.77} viewBox="0 0 32 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M1.17157 1.17157C2.73367 -0.390524 5.26633 -0.390524 6.82843 1.17157L30.1213 24.4645C32.0739 26.4171 32.074 29.5829 30.1213 31.5355L6.82843 54.8284C5.26633 56.3905 2.73367 56.3905 1.17157 54.8284C-0.390524 53.2663 -0.390524 50.7337 1.17157 49.1716L22.3431 28L1.17157 6.82843C-0.390524 5.26633 -0.390524 2.73367 1.17157 1.17157Z"
                      fill="#D1D1D1"/>
            </svg>
        </div>
    );
}

export default RightPointer;
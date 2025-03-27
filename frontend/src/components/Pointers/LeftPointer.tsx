import {usePointer} from "../../hooks/usePointer";
import './Pointer.css'
import {useResize} from "../../hooks/useResize";

interface LeftPointerProps {
    page: string;
    onPageChange: (page: string) => void;
}

const LeftPointer: React.FC<LeftPointerProps> = ({page, onPageChange}) => {
    const newPage = usePointer({page, direction: 'left'})
    const size = useResize(30, 50);

    return (
        <div style={{width: `${size * 1.5}px`, height: `${size * 3 * 1.77}px`}}
             className='LeftPointer' onClick={() => onPageChange(newPage)}>
            <svg width={size} height={size * 1.77} viewBox="0 0 43 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M40.7713 2.22875C42.8541 4.31155 42.8541 7.68843 40.7713 9.77123L12.5425 38L40.7713 66.2288C42.8541 68.3116 42.8541 71.6884 40.7713 73.7712C38.6885 75.854 35.3116 75.854 33.2288 73.7712L2.17162 42.714C-0.431885 40.1105 -0.431874 35.8894 2.17162 33.2859L33.2288 2.22875C35.3116 0.145957 38.6885 0.145957 40.7713 2.22875Z"
                      fill="black"/>
            </svg>
        </div>
    );
}

export default LeftPointer;
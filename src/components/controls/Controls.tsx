import './Controls.css'
import IconPlus from "../icons/IconPlus";
import IconMinus from "../icons/IconMinus";
import {useResize} from "../../hooks/useResize";
import IconGenerate from "../icons/IconGenerate";
import IconPath from "../icons/IconPath";

interface ControlsProps {
    size: number;
    sizeUp: () => void;
    sizeDown: () => void;
    onGenerate: () => void;
    onCommand: () => void;
    commandName: string;
    fullnessUp: () => void;
    fullnessDown: () => void;
    fullnes: number;
}

const Controls: React.FC<ControlsProps> = ({
                                               size,
                                               sizeUp,
                                               sizeDown,
                                               onCommand,
                                               onGenerate,
                                               commandName,
                                               fullnessUp,
                                               fullnessDown,
                                               fullnes
                                           }) => {
    const iconSize = useResize(75, 20);

    return (
        <div className='buttons-group'>
            <div className='resize-container'>
                <button className='button-down' onClick={() => sizeDown()}>
                    <IconMinus size={iconSize}/>
                </button>
                <p>{size}</p>
                <button className='button-up' onClick={() => sizeUp()}>
                    <IconPlus size={iconSize}/>
                </button>
            </div>
            <div className='resize-container'>
                <button className='button-down' onClick={() => fullnessDown()}>
                    <IconMinus size={iconSize}/>
                </button>
                <p>{fullnes}%</p>
                <button className='button-up' onClick={() => fullnessUp()}>
                    <IconPlus size={iconSize}/>
                </button>
            </div>
            <div className='commands-container' onClick={onGenerate}>
                <button className='button-generate'>Сгенерировать</button>
                <IconGenerate size={iconSize}/>
            </div>
            <div className='commands-container' onClick={onCommand}>
                <button className='button-path'>{commandName}</button>
                <IconPath size={iconSize}/>
            </div>
        </div>);
};

export default Controls;
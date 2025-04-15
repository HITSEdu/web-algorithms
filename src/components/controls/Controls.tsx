import './Controls.css'
import IconPlus from "../icons/IconPlus";
import IconMinus from "../icons/IconMinus";
import {useResize} from "../../hooks/useResize";
import IconGenerate from "../icons/IconGenerate";
import IconPath from "../icons/IconPath";
import CommandButton from "./CommandButton";

interface ControlsProps {
    size: number;
    sizeUp: () => void;
    sizeDown: () => void;
    onGenerate: () => void;
    onCommand: () => void;
    commandName: string;
    fullnessUp: () => void;
    fullnessDown: () => void;
    fullness: number;
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
                                               fullness
                                           }) => {
    const iconSize = useResize(40, 30, 15, 'min');

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
                <p>{fullness}%</p>
                <button className='button-up' onClick={() => fullnessUp()}>
                    <IconPlus size={iconSize}/>
                </button>
            </div>
            <div className='generate-button'>
                <CommandButton commandName='Сгенерировать' Icon={IconGenerate} onCommand={onGenerate}
                               iconSize={iconSize}/>
            </div>
            <CommandButton commandName={commandName} Icon={IconPath} onCommand={onCommand} iconSize={iconSize}/>
        </div>);
};

export default Controls;
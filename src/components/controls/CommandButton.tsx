interface CommandButtonProps {
    onCommand: () => void;
    Icon: React.ElementType;
    commandName: string;
    iconSize?: number;
}

const CommandButton: React.FC<CommandButtonProps> = ({onCommand, Icon, commandName, iconSize}) => {
    return (
        <div className="commands-container" onClick={onCommand}>
            <button>{commandName}</button>
            <Icon size={iconSize}/>
        </div>
    );
};

export default CommandButton;
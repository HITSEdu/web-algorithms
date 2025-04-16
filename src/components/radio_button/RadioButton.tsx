import React, {useState, useEffect} from 'react';
import './RadioButton.css';

type Props = {
    options: string[];
    best: string;
    onChange: (value: string) => void;
    orientation: "row" | "column";
};

const RadioButton: React.FC<Props> = ({options, best, onChange, orientation}) => {
    const [selectedValue, setSelectedValue] = useState<string>(best);

    useEffect(() => {
        setSelectedValue(best);
    }, [best]);

    const handleChange = (value: string) => {
        setSelectedValue(value);
        onChange(value);
    };

    return (
        <div className="radio-input"
             style={{
                 flexDirection: orientation,
                 width: orientation === 'column' ? '1rem' : `${options.length * 4.2}vh`,
                 height: orientation === 'column' ? `${options.length * 4.2}vh` : '1rem',
             }}>
            {options.map((value, index) => (
                <label
                    key={value}
                    className={`radio-button ${selectedValue === value ? 'selected' : ''} ${value === best ? 'best' : ''}`}
                >
                    <input
                        type="radio"
                        id={`value-${index}`}
                        name="value-radio"
                        value={value}
                        checked={selectedValue === value}
                        onChange={() => handleChange(value)}
                    />
                    <span>{value}</span>
                </label>
            ))}
            <span className="selection"/>
        </div>
    );
};

export default RadioButton;

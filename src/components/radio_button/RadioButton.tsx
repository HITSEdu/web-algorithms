import React, {useState, useEffect} from 'react';
import './RadioButton.css';

type Props = {
    options: string[];
    best: string;
    onChange: (value: string) => void;
    orientation: "row" | "column";
    bestColor?: string;
};

const RadioButton: React.FC<Props> = ({options, best, onChange, orientation, bestColor}) => {
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
             }}>
            {options.map((value, index) => (
                <label
                key={value}
                className={`radio-button ${selectedValue === value ? 'selected' : ''} ${value === best ? 'best' : ''}`}
                style={value === best ? { backgroundColor: bestColor || '#3BACD9' } : {}}
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

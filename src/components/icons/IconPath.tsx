const IconPath: React.FC<{ size: number }> = ({size}) => {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="3" r="2.25" stroke="#D1D1D1" stroke-width="1.5"/>
            <circle cx="21" cy="3" r="2.25" stroke="#D1D1D1" stroke-width="1.5"/>
            <circle cx="29" cy="9" r="2.25" stroke="#D1D1D1" stroke-width="1.5"/>
            <circle cx="21" cy="15" r="2.25" stroke="#D1D1D1" stroke-width="1.5"/>
            <circle cx="21" cy="29" r="2.25" stroke="#D1D1D1" stroke-width="1.5"/>
            <circle cx="11" cy="15" r="2.25" stroke="#D1D1D1" stroke-width="1.5"/>
            <circle cx="3" cy="23" r="2.25" stroke="#D1D1D1" stroke-width="1.5"/>
            <circle cx="11" cy="29" r="2.25" stroke="#D1D1D1" stroke-width="1.5"/>
            <path d="M1 3H9" stroke="#D1D1D1" stroke-linecap="round"/>
            <path d="M13 3H19" stroke="#D1D1D1" stroke-linecap="round"/>
            <path d="M23 3H25C27.2091 3 29 4.79086 29 7V7" stroke="#D1D1D1" stroke-linecap="round"/>
            <path d="M29 11V11C29 13.2091 27.2091 15 25 15H23" stroke="#D1D1D1" stroke-linecap="round"/>
            <path d="M19 15H13" stroke="#D1D1D1" stroke-linecap="round"/>
            <path d="M9 15H7C4.79086 15 3 16.7909 3 19V21" stroke="#D1D1D1" stroke-linecap="round"/>
            <path d="M3 25V25C3 27.2091 4.79086 29 7 29H9" stroke="#D1D1D1" stroke-linecap="round"/>
            <path d="M13 29H19" stroke="#D1D1D1" stroke-linecap="round"/>
        </svg>

    );
};

export default IconPath;

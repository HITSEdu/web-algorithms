const ChangeThemeIcon: React.FC<{ size: number }> = ({size}) => {
    return (
        <svg width={size} height={size * 1.36 / 2} viewBox="0 0 136 68" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <rect width="136" height="68" rx="34" fill="#1A1A1A"/>
            <circle cx="97" cy="34" r="27" fill="#FBAF1D"/>
            <circle cx="79" cy="34" r="27" fill="#1A1A1A"/>
        </svg>
    );
};

export default ChangeThemeIcon;
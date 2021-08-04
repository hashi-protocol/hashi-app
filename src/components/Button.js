import React from "react";
import styles from './button.module.css';

const Button = ({ children, onClick, btnColor = 'teal', labelColor, disabled, type, style, ...props }) => {

    const [
        hover,
        setHover
    ] = React.useState(false);

    const toggleHover = () => {
        setHover(!hover)
    };

    const primaryStyle = {
        backgroundColor: '#1161fe',
        border: 'none',
        color: labelColor || 'black'
    }
    const secondaryStyle = {
        backgroundColor: '#00000000',
        border: 'solid 2px black',
        color: labelColor || 'white'
    }
    const commonStyles = {
        backgroundColor: btnColor,
        color: labelColor || 'white'
    };
    const disabledStyle = {
        cursor: 'default',
        backgroundColor: btnColor,
        color: labelColor || 'white',
        opacity: 0.4
    };

    let btnStyle;

    switch (type) {
        case 'primary':
            btnStyle = primaryStyle;
            break;
        case 'secondary':
            btnStyle = secondaryStyle
            break;
        default:
            btnStyle = primaryStyle;
    }

    return (
        <button
            style={

                disabled ? { ...commonStyles, ...btnStyle, ...disabledStyle, ...style } :
                    { ...commonStyles, ...btnStyle, ...style }
            }
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
            {...props}
            type="button"
            onClick={
                !disabled ? onClick : () => { }
            }
            className={styles.btn} >
            {children || 'button'}
        </button >
    )
}

export default Button;
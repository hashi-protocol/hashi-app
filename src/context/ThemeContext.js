import React, { useState, useLayoutEffect } from 'react';

const ThemeContext = React.createContext({
    dark: true,
    toggle: () => {},
});

export default ThemeContext;

export function ThemeProvider (props) {
    // keeps state of the current chosen theme
    const [dark, setDark] = useState(window.localStorage.getItem('darkTheme'));

    // paints the app before it renders elements
    useLayoutEffect(() => {
        const lastTheme = window.localStorage.getItem('darkTheme');

        if (lastTheme === 'true') {
            setDark(true);
            applyTheme(darkTheme);
        }

        if (!lastTheme || lastTheme === 'false') {
            setDark(false);
            applyTheme(lightTheme);
        }
        // if state changes, repaints the app
    }, [dark]);

    const applyTheme = theme => {
        const root = document.getElementsByClassName('App')[0];
        root.style.cssText = theme.join(';');
    }

    const toggle = () => {
        setDark(!dark);
        window.localStorage.setItem('darkTheme', !dark);
    };

    return <ThemeContext.Provider value={{ dark, toggle }}> {props.children} </ThemeContext.Provider>
}

// styles
const lightTheme = [
    '--background: linear-gradient(264.99deg,rgb(255 255 255),rgb(255 242 242) 95.58%)',
    '--button-primary-color: rgb(255 55 249 / 23%)',
    '--button-text-color: #000',
    '--text-color: #000',
    '--container-box-shadow: 0 12px 35px 0 rgb(181 181 181 / 75%)',
    '--container-background: #FFFFFFB3'
];



const darkTheme = [
    '--background: linear-gradient(264.99deg,#401440 -52.92%,#010b1f 95.58%)',
    '--button-primary-color: #1161fe',
    '--button-text-color: #fff',
    '--text-color: #fff',
    '--container-box-shadow: 0 12px 35px 0 rgb(6 12 28 / 75%)',
    '--container-background: #26253db3'
];

import React, { useContext } from 'react';
import { IoMdMoon as Moon, IoMdSunny as Sun } from 'react-icons/io';
import styles from './themeswitch.module.css'


import ThemeContext from '../context/ThemeContext';

export default function Switch () {
    const { dark, toggle } = useContext(ThemeContext);

    let button;
    if (dark) {
        button = <Sun className={`icon ${!dark ? 'active' : ''}`}/>
    }  else {
        button = <Moon className={`icon ${dark ? 'active' : ''}`}/>
    }

    return (
        <div>
            <label id="switch" className={styles.switch}>
                <input type="checkbox" onChange={() => toggle()} id="slider"/>
                {/*{button}*/}
                <div className={`${styles.slider} ${styles.round}`}>
                    {button}
                </div>
            </label>
        </div>
    );
}

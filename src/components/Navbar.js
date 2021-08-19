import React, { useContext } from 'react';
import styles from './navbar.module.css'
import { ReactComponent as Logo } from '../static/bridge.svg';
import { ReactComponent as WhiteName } from '../static/name-white.svg';
import { ReactComponent as BlackName } from '../static/name-black.svg';
import EthereumButton from "./MetamaskButton";
import ThemeSwitch from "./ThemeSwitch";
import ThemeContext from '../context/ThemeContext';


const Navbar = () => {

    const { dark, } = useContext(ThemeContext);

    function Name() {
        if (dark) {
            return (<WhiteName className={styles.name} />)
        } else {
            return (<BlackName className={styles.name} />)
        }
    }

    return (
        <div className={`${styles.navbar} navbar`} >
            <div className={styles.left}>
                <Logo className={styles.icon} fill='var(--text-color)' />
                <Name />
            </div>
            <EthereumButton />
            <ThemeSwitch />
        </div >
    )
}

export default Navbar;

import React, { useContext } from 'react';
import styles from './navbar.module.css'
import { ReactComponent as Logo } from '../static/bridge.svg';
import { ReactComponent as WhiteName } from '../static/name-white.svg';
import { ReactComponent as BlackName } from '../static/name-black.svg';
import EthereumButton from "./MetamaskButton";
import ThemeSwitch from "./ThemeSwitch";
import ThemeContext from '../context/ThemeContext';
import Active from './connectTez'
import Typography from "./Typography";
import BigNumber from "bignumber.js";
import WalletsButton from './WalletsButton';
import { Link } from "react-router-dom";


import { Nav } from "react-bootstrap";


const Navbar = (props) => {

    const { dark, } = useContext(ThemeContext);

    function TezosButton() {
        return (
            <Active />
        )
    }

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
                <Nav style={{ display: "flex", flexDirection: "row" }}>
                    <Link className={`${styles.link}`} to="/"><Typography variant="body1">Home</Typography></Link>
                    <Link className={`${styles.link}`} to="/eth-to-tezos"><Typography variant="body1">ETHToTezos</Typography></Link>
                    <Link className={`${styles.link}`} to="/tezos-to-eth"><Typography variant="body1">TezosToETH</Typography></Link>
                </Nav>
            </div>
            <div className={styles.right}>
                <Typography variant="body1" hidden={props.status !== 'connected'}>Balance: {new BigNumber(props.balance).toFixed(2)} ETH</Typography>
                <ThemeSwitch />
                <WalletsButton >
                    <div>
                        <TezosButton />
                        <EthereumButton />
                    </div>
                </WalletsButton>
            </div>
        </div >
    )
}

export default Navbar;

import React, { useContext } from 'react';
import styles from './navbar.module.css'
import { ReactComponent as Logo } from '../static/bridge.svg';
import { ReactComponent as WhiteName } from '../static/name-white.svg';
import { ReactComponent as BlackName } from '../static/name-black.svg';
import EthereumButton from "./MetamaskButton";
import ThemeSwitch from "./ThemeSwitch";
import ThemeContext from '../context/ThemeContext';
import Active from './connectTez'
import { WalletProvider } from '@tezos-contrib/react-wallet-provider';
import Typography from "./Typography";
import BigNumber from "bignumber.js";
import WalletsButton from './WalletsButton';

const Navbar = (props) => {

    const { dark, } = useContext(ThemeContext);

    function TezosButton() {
        return (
            <WalletProvider name="my-example-app" clientType="beacon">
                <Active />
            </WalletProvider>
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

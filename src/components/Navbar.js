import React, { useContext, useState } from 'react';
import styles from './navbar.module.css'
import { ReactComponent as Logo } from '../static/bridge.svg';
import { ReactComponent as WhiteName } from '../static/name-white.svg';
import { ReactComponent as BlackName } from '../static/name-black.svg';
import EthereumButton from "./MetamaskButton";
import ConnectButton from './ConnectWallet';
import ThemeSwitch from "./ThemeSwitch";
import ThemeContext from '../context/ThemeContext';
import Typography from "./Typography";
import BigNumber from "bignumber.js";
import { TezosToolkit } from "@taquito/taquito";


const Navbar = (props) => {

    const [Tezos,] = useState(
        new TezosToolkit("https://api.tez.ie/rpc/granadanet")
    );
    const [, setContract] = useState(undefined);
    const [, setPublicToken] = useState("");
    const [wallet, setWallet] = useState(null);
    const [, setUserAddress] = useState("");
    const [, setUserBalance] = useState(0);
    const [, setStorage] = useState(0);
    const [,] = useState(false);
    const [, setBeaconConnection] = useState(false);
    const [,] = useState("transfer");

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
            <ConnectButton
                Tezos={Tezos}
                setContract={setContract}
                setPublicToken={setPublicToken}
                setWallet={setWallet}
                setUserAddress={setUserAddress}
                setUserBalance={setUserBalance}
                setStorage={setStorage}
                setBeaconConnection={setBeaconConnection}
                wallet={wallet}
            />
            <EthereumButton />
            <ThemeSwitch />
            <Typography variant="body1" hidden={props.status !== 'connected'}>Balance: {new BigNumber(props.balance).toFixed(2)} ETH</Typography>
        </div >
    )
}

export default Navbar;

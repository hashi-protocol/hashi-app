import React from 'react';
import styles from './navbar.module.css'
import logo from '../static/bridge.svg'
import EthereumButton from "./MetamaskButton";

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
        };
    }


    render() {
        return (
            <div className={`${styles.navbar} navbar`} >
                <img
                    className={styles.icon}
                    src={logo} />
                <EthereumButton/>
            </div >
        )
    }
}

export default Navbar;

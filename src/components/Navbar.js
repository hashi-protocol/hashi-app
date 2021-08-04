import React from 'react';
import styles from './navbar.module.css'
import logo from '../static/bridge.svg'
import Button from './Button';



class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
        };
    }

    render() {
        return (
            <div className={styles.navbar} >
                <img
                    className={styles.icon}
                    src={logo} />
                <Button type="secondary"> Connect wallet </Button>
            </div >
        )
    }
}

export default Navbar;
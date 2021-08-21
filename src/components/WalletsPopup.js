import React from 'react';
import styles from './walletsPopup.module.css'
import Typography from './Typography';
import Button from './Button';
import { style } from 'dom-helpers';

const WalletsPopup = ({ children, handleClose }) => {
    return (
        <div className={styles.popupBox}>
            <div className={styles.box}>
                <button className={styles.close} onClick={handleClose} fill='var(--button-text-color)'>x</button>
                <Typography variant='h5'>Connect both wallets</Typography>
                {children}
            </div>
        </div>
    )
}

export default WalletsPopup;
import React, { Component } from 'react';
import styles from './footer.module.css'
import Typography from './Typography';

class Footer extends Component {

    render() {
        return (
            <div className={styles.footer}>
                <a href="https://github.com/hashi-protocol" className={styles.item}>
                    <Typography variant="body2">
                        GitHub
                    </Typography>
                </a>
                <Typography variant="body2">|</Typography>
                <a href="https://github.com/hashi-protocol" className={styles.item}>
                    <Typography variant="body2">
                        Telegram
                    </Typography>
                </a>
                <Typography variant="body2">|</Typography>
                <a href="https://gitcoin.co/hackathon/tezos/projects/6394/tezos-nft/summary/" className={styles.item}>
                    <Typography variant="body2">
                        Gitcoin
                    </Typography>
                </a>
                <Typography variant="body2">|</Typography>
                <a href="https://github.com/hashi-protocol/hashi-whitepaper/blob/master/whitepaper.pdf" className={styles.item}>
                    <Typography variant="body2">
                        Whitepaper
                    </Typography>
                </a>
            </div>
        )
    }
}

export default Footer;
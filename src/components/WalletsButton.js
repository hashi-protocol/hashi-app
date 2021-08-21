import React from 'react';
import Button from "./Button.js"
import WalletsPopup from './WalletsPopup.js';

const WalletsButton = ({ children }) => {

    const [open, setOpen] = React.useState(false);

    let onClick = () => {
        setOpen(!open);
    }

    function Popup() {
        return (
            <WalletsPopup handleClose={onClick}>
                {children}
            </WalletsPopup >
        )
    }

    return (
        <div>
            <Button onClick={onClick}>
                Connect wallets
            </Button>
            {open && <Popup />}
        </div>
    )
};

export default WalletsButton;
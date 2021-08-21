import React  from "react";
import {useMetaMask} from "metamask-react";
import Button from "./Button";
import Typography from "./Typography";

export default function EthereumButton() {

    const { status, connect, account } = useMetaMask();

    let ethStatus = "";

    if (status === "initializing") ethStatus = <Typography variant="body1">Synchronisation with MetaMask ongoing...</Typography>

    if (status === "unavailable") ethStatus = <Typography variant="body1">Please, install the MetaMask wallet</Typography>

    if (status === "notConnected") ethStatus = <Button onClick={connect}>Connect to MetaMask</Button>

    if (status === "connecting") ethStatus = <Typography variant="body1">Connecting...</Typography>

    if (status === "connected") ethStatus = <Typography variant="body1">Signed as: {account.replace(account.substring(4,38), "...")}</Typography>

    return ethStatus;
}

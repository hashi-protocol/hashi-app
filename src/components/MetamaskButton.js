import React  from "react";
import {useMetaMask} from "metamask-react";
import Button from "./Button";
import Typography from "./Typography";

export default function EthereumButton() {

    const { status, connect, account } = useMetaMask();

    let ethStatus = "";

    if (status === "initializing") ethStatus = <div>Synchronisation with MetaMask ongoing...</div>

    if (status === "unavailable") ethStatus = <div>Please, install the MetaMask wallet</div>

    if (status === "notConnected") ethStatus = <Button onClick={connect}>Connect to MetaMask</Button>

    if (status === "connecting") ethStatus = <div>Connecting...</div>

    if (status === "connected") ethStatus = <div>Connected account: {account}</div>

    return <Typography variant="body1">{ethStatus}</Typography> ;


}

import React from "react";
import { useMetaMask } from "metamask-react";
import Button from "./Button";

export default function EthereumButton() {

    const { status, connect, account } = useMetaMask();

    let ethStatus = "";

    if (status === "initializing") ethStatus = <div>Synchronisation with MetaMask ongoing...</div>

    if (status === "unavailable") ethStatus = <div>Please, install the MetaMask wallet</div>

    if (status === "notConnected") ethStatus = <div>Connect to MetaMask</div>

    if (status === "connecting") ethStatus = <div>Connecting...</div>

    if (status === "connected") ethStatus = <div>Connected account: {account}</div>

    return <Button onClick={connect} variant="body1">{ethStatus}</Button>;


}

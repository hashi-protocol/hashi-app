import { useWallet } from '@tezos-contrib/react-wallet-provider';
import React from "react";
import Button from "./Button"

function Active() {
  const { connected, activeAccount, connect, disconnect } = useWallet();
  return (
    <div>
      <header>
        {!connected && <Button onClick={connect}>Connect to a Tezos Wallet</Button>}
        {connected && (
          <Button onClick={disconnect}>Disconnect from {activeAccount?.address}</Button>
        )}
      </header>
    </div>
  );

}

export default Active;
import React from "react";
import Button from "./Button"

function BeaconButton(props) {
  return (
    <div>
      <header>
        {!props.connected && <Button onClick={props.connect}>Connect to a Tezos Wallet</Button>}
        {props.connected && (
          <Button onClick={props.disconnect}>Disconnect from {props.activeAccount?.address}</Button>
        )}
      </header>
    </div>
  );

}

export default BeaconButton;

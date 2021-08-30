import React from "react";
import Button from "./Button"

class BeaconButton extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      Tezos: this.props.Tezos,
      wallet: this.props.wallet
    }

    this.setupBeacon = this.setupBeacon.bind(this);
    this.getActiveAccount = this.getActiveAccount.bind(this);
    this.isConnected = this.isConnected.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  async setupBeacon(wallet) {
    try {
      console.log("Requesting permissions...");
      const permissions = await wallet.client.requestPermissions();
      console.log("Got permissions:", permissions.address);
    } catch (error) {
      console.log("Got error:", error);
    }
  }

  async getActiveAccount(wallet) {
    const activeAccount = await wallet.client.getActiveAccount();
    return activeAccount;
  }

  async isConnected(wallet) {
    // The following code should always be run during pageload if you want to show if the user is connected.
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      // User already has account connected, everything is ready
      // You can now do an operation request, sign request, or send another permission request to switch wallet
      console.log("Already connected:", activeAccount.address);
      return true;
    } else {
      // The user is not connected. A button should be displayed where the user can connect to his wallet.
      console.log("Not connected!");
      return false;
    }
  }

  async disconnect(wallet) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await wallet.clearActiveAccount();

    try {
      const account = await wallet.getPKH();
      console.log("Active Account", account);
    } catch {
      console.log("No wallet connected");
    }
  }

  render() {
    return (
      <header>
        {!false && <Button onClick={() => this.setupBeacon(this.props.wallet)}>Connect to a Tezos Wallet</Button>}
        {
          false && (
            <Button onClick={() => this.disconnect(this.props.wallet)}>Disconnect from {this.getActiveAccount(this.props.wallet)}</Button>
          )
        }
      </header >
    )
  }

}

export default BeaconButton;

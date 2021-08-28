import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import { useMetaMask } from 'metamask-react'
import Routes from './Routes';
import { BrowserRouter as Router } from "react-router-dom";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";
require('dotenv').config()

function App() {

  const { ethereum, status, account } = useMetaMask();
  const [balance, setBalance] = useState(0);

  const Tezos = new TezosToolkit("https://florencenet.smartpy.io/");
  const wallet = new BeaconWallet({
    name: "Hashi app",
    preferredNetwork: NetworkType.FLORENCENET,
  });
  Tezos.setWalletProvider(wallet);

  async function setupBeacon(wallet) {
    try {
      console.log("Requesting permissions...");
      const permissions = await wallet.client.requestPermissions({
        network: {
          type: NetworkType.FLORENCENET,
        },
      });
      console.log("Got permissions:", permissions.address);
    } catch (error) {
      console.log("Got error:", error);
    }
  }

  if (!wallet.getPKH()) { setupBeacon(wallet) }

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Navbar status={status} balance={balance} />
          <div className="Content">
            <Routes
              ethereum={ethereum}
              status={status}
              account={account}
              setBalance={setBalance}
              Tezos={Tezos}
              wallet={wallet}
              tz1={wallet.getPKH()}
            />
          </div>
          <Footer />
        </header>
      </Router>
    </div>
  );
}
export default App;

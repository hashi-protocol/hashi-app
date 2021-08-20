import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar.js'
import Bridge from './components/Bridge.js'
import { useMetaMask } from 'metamask-react'
// import { TezosToolkit } from "@taquito/taquito";

function App() {
  // const [Tezos,] = useState<TezosToolkit>(
  //   new TezosToolkit("https://api.tez.ie/rpc/granadanet")
  // );
  // const [, setContract] = useState<any>(undefined);
  // const [, setPublicToken] = useState<string | null>("");
  // const [wallet, setWallet] = useState<any>(null);
  // const [, setUserAddress] = useState<string>("");
  // const [, setUserBalance] = useState<number>(0);
  // const [, setStorage] = useState<number>(0);
  // const [,] = useState<boolean>(false);
  // const [, setBeaconConnection] = useState<boolean>(false);
  // const [,] = useState<string>("transfer");

  const { ethereum, status, account } = useMetaMask();
  const [balance, setBalance] = useState(0);

  return (
      <div className="App">
        <header className="App-header">
          <Navbar status={status} balance={balance}/>
          <div className="Content">
            <Bridge ethereum={ethereum} status={status} account={account} setBalance={setBalance}/>
          </div>
        </header>
      </div>
  );
}
export default App;

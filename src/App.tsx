import './App.css';
import Navbar from './components/Navbar.js'
import Bridge from './components/Bridge.js'
import { MetaMaskProvider } from 'metamask-react'
import React from "react";
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

  return (
    <div className="App">
      <MetaMaskProvider>
        <header className="App-header">
          <Navbar />
          <div className="Content">
            <Bridge />
          </div>
        </header>
      </MetaMaskProvider>
    </div>
  );
}

export default App;

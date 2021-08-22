import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import { useMetaMask } from 'metamask-react'
import Routes from './Routes';
import { BrowserRouter as Router } from "react-router-dom";
import { WalletProvider } from '@tezos-contrib/react-wallet-provider';
require('dotenv').config()

function App() {

  const { ethereum, status, account } = useMetaMask();
  const [balance, setBalance] = useState(0);

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <WalletProvider name="hashi-protocol" clientType="beacon">
            <Navbar status={status} balance={balance} />
            <div className="Content">
              <Routes
                ethereum={ethereum}
                status={status}
                account={account}
                setBalance={setBalance}
              />
            </div>
            <Footer />
          </WalletProvider>
        </header>
      </Router>
    </div>
  );
}
export default App;

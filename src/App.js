import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar.js'
import Bridge from './components/Bridge.js'
import { useMetaMask } from 'metamask-react'
require('dotenv').config()

function App() {

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

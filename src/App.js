import './App.css';
import Navbar from './components/Navbar.js'
import Bridge from './components/Bridge.js'
import { MetaMaskProvider } from 'metamask-react'
import ThemeSwitch from "./components/ThemeSwitch";
import React from "react";


function App() {
    return (
    <div className="App">
        <MetaMaskProvider>
            <header className="App-header">
                <Navbar />
                <ThemeSwitch/>
                <div className="Content">
                    <Bridge />
                </div>
            </header>
        </MetaMaskProvider>
    </div>
  );
}

export default App;

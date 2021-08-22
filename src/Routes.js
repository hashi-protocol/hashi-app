import React from 'react';
import { Switch, Route } from "react-router-dom";
import { ETHToTezos, TezosToETH, MainPage } from "./pages/pages";
import { useWallet } from '@tezos-contrib/react-wallet-provider';

function Routes(props) {

    const { connected, activeAccount } = useWallet();

    return (
        <Switch>
            <Route exact path="/" children={<MainPage {...props} />} />
            <Route path="/eth-to-tezos" children={<ETHToTezos tezosAddress={activeAccount?.address} tezosConnected={connected} {...props} />} />
            <Route path="/tezos-to-eth" children={<TezosToETH {...props} />} />
        </Switch>
    );
}
export default Routes;

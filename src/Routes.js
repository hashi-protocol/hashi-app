import React from 'react';
import { Switch, Route } from "react-router-dom";
import { ETHToTezos, TezosToETH, MainPage } from "./pages/pages";

function Routes(props) {
    return (
        <Switch>
            <Route exact path="/" children={<MainPage {...props}/>}/>
            <Route path="/eth-to-tezos" children={<ETHToTezos {...props}/>} />
            <Route path="/tezos-to-eth" children={<TezosToETH {...props}/>} />
        </Switch>
    );
}
export default Routes;

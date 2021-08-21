import { useState } from 'react';
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

const Tezos = new TezosToolkit("https://mainnet-tezos.giganode.io");
const wallet = new BeaconWallet({ name: "Beacon Docs Taquito" });

Tezos.setWalletProvider(wallet);

function TezConnect() {
	try {
	  console.log("Requesting permissions...");
	  const permissions = await wallet.client.requestPermissions();
	  console.log("Got permissions:", permissions.address);
	} catch (error) {
	  console.log("Got error:", error);
	}

}
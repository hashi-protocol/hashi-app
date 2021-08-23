# Hashi app

We built the first and only bridge for all your Non Fungible Tokens between Tezos and Ethereum. 

- You can wrap any FA2 token to Ethereum
- Or any ERC-721 token to Tezos

### Convinience

Any FA2 or ERC-721 token can be bridged through Hashi. The tokens can be wrapped or recovered at any time. If you decide to sell the wrap NFT, to new owner will be able to unwrap it in its principal chain.

### Decentralization

The protocol, unlike most of the bridges out there, can be use in a full trustless manner. We just deploy the 4 contracts needed to achieve this (2 per chain), and everything can happen without us now. Of course we also build an app, for non-nerds that just want to expand the field of possibilities for their NFTs.

### Security

We imagined the protocol in such a way that there is no multi chain transactions, which are often attack vectors for bridges. Plus, it allow to add other blockchains in the protocol quickly, to expand the ecosystem of NFT tezos again and again.

## Quick start

Clone the project 
```
git clone https://github.com/hashi-protocol/hashi-app.git && cd hashi-app
```

Dependancies
```
yarn install
```

Connect your Ethereum wallet on the `Ropsten` testnet

Connect your Tezos wallet on the `Florencenet` testnet

You are ready to try Hashi ! ✨

(We deployed a nice NFT faucet so that everyone can try and give feedback)

## Useful links

- App : https://hashi-protocol.netlify.app/

- [Youtube Video](https://www.youtube.com/watch?v=KRsYEKjtffU)
- Tezos wrapper
  - [Code](https://github.com/hashi-protocol/hashi-tezos/blob/master/python-contracts/modifiedFA2.py)
  - [KT1KYh1VoxKbmTjizhTQfbpvUSNxRbiZufha](https://florencenet.tzkt.io/KT1KYh1VoxKbmTjizhTQfbpvUSNxRbiZufha/operations/)
- Ethereum locker
  - [Code](https://github.com/hashi-protocol/hashi-ethereum/blob/master/NFTLock.sol)
  - [0x3Af52fa879F13eEb90b98CEb07449f7A1Bd2Fd70](https://ropsten.etherscan.io/address/0x3Af52fa879F13eEb90b98CEb07449f7A1Bd2Fd70)
- Ethereum faucet
  - [Code](https://github.com/hashi-protocol/hashi-ethereum-nft-faucet/blob/master/contracts/Nft.sol)
  - [0xEEA8eCCF0c573F559447348F66224270e6E7937E](https://ropsten.etherscan.io/address/0xEEA8eCCF0c573F559447348F66224270e6E7937E)
- Ethereum wrapper
  - [Code](https://github.com/hashi-protocol/hashi-ethereum/blob/master/tzNFT.sol)
  - [0x8C26e1553602f5f80759C4F93Fb97cf4757c5baa](https://ropsten.etherscan.io/address/0x8C26e1553602f5f80759C4F93Fb97cf4757c5baa)

## Operation (simplified)

### Idea

Each chain has two contracts: 
- a locker, which store the NFT on their main chain until the wrap version is burn.
- a minter, or wrapper, which mint the wrap token, with the same metadata.

The operation is pretty simple: a user comes and lock its NFT into the locker on chain A. Then he mint a wrapped token on chain B. And when he wants to recover its original NFT, he burns the wrapped one (we have equipped it with this function) and he can unlock it on blockchain A.

### Security

Now we are able to lock, mint, burn and unlock NFTs from Tezos to Ethereum. But what is to stop someone from mining his own nft several times, or even mining a nft that is not his ? And what happen if the wrapped NFT has been sold ?

So we have some checks to do before letting these operations take place :
- check if an NFT has already been wrapped before wrapping it
- check if a wrapped NFT has been burned on blockchain B before unlocking it on blockchain A
- check that user who wants to wrap an NFT on blockchain B is the owner of it on blockchain A
- check that user who wants to unlock an NFT on blockchain A was the last owner of it on blockchain A 

### Decentralization

Of course we could have done this of chain, one a secured server. But that is not what we wanted to do here. We wanted Hashi to be fully trustless, fully decentralized, and fully autonomous. 

So we managed to find solutions to these security checks with decentralized oracles and with adding on chain storage on certain functions. More on that in the coming whitepaper...

### Summary

Let's take an example. Alice owns a beautful NFT on the Ethereum blockchain, and wants to use it in art galleries or games, but with low fees, and with the minor ecological impact of Tezos.

#### She wraps it using Hashi :

![hashi - wrap](https://user-images.githubusercontent.com/74971347/130337548-3487f31a-6c8e-4047-80d2-6cf1124a9d12.jpg)

#### And when she wants to recover it :

![hashi - unwrap](https://user-images.githubusercontent.com/74971347/130337551-0670e06d-e162-4dbc-9d48-2be576e3528d.jpg)

## About 

This project was built by :

- Nikita Terekhov
- Pierre-Antoine Arsaguet
- Mathis Gontier Delaunay

We are all engineering student from Telecom SudParis, and INSA Lyon. We met with [KRYPTOSPHERE](https://kryptosphere.org/en/), the first and biggest french student association working on blockchain and new technologies.

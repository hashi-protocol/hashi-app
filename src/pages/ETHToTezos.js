import React, { Component } from 'react';
import Container from '../components/Container';
import Typography from '../components/Typography';
import Button from '../components/Button';
import Web3 from "web3";
import axios from "axios";
import querystring from "querystring";
import SwiperNFT from "../components/SwiperNFT";
import tzNFT from "../static/tzNFT.json"
import ERC721 from "../static/ERC721.json"
import FaucetERC721 from "../static/FaucetERC721.json"
import { trackPromise } from 'react-promise-tracker';
import { NFTStorage, toGatewayURL } from 'nft.storage';
import LoadingSpiner from '../components/LoadingSpiner';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';


const Tezos = new TezosToolkit('https://florencenet.smartpy.io');
//Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey('edskRyBUqwfz4sKwQiePyfRSagzaHkBwFBRCgjAA9HL9vp6cSf1KQBffVxV9Yj8TEKNGhp5Lbh8XkJdp1w93fhYSKWVYe6j9fp') });
InMemorySigner.fromSecretKey('edskRyBUqwfz4sKwQiePyfRSagzaHkBwFBRCgjAA9HL9vp6cSf1KQBffVxV9Yj8TEKNGhp5Lbh8XkJdp1w93fhYSKWVYe6j9fp')
    .then((theSigner) => {
        Tezos.setProvider({ signer: theSigner });
        //We can access the public key hash
        return Tezos.signer.publicKeyHash();
    })
    .then((publicKeyHash) => {
        console.log(`The public key hash associated is: ${publicKeyHash}.`);
    })
    .catch((error) => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));

class Bridge extends Component {

    constructor() {
        super();

        this.state = {
            web3: null,
            NFTs: [],
            hasNFTs: true,
            NFTFaucetContract: null,
            nftStorageClient: new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE }),
            WrappedNFTs: [],
            hasWrappedNFTs: false,
            tzLockedNFTsNeedsUpdate: true
        }

        this.initWeb3 = this.initWeb3.bind(this);
        this.fetchNFTsFromEth = this.fetchNFTsFromEth.bind(this);
        this.handleNFTLock = this.handleNFTLock.bind(this);
        this.handleNFTGenerationETH = this.handleNFTGenerationETH.bind(this);
        this.queryNFTsFromGraph = this.queryNFTsFromGraph.bind(this);
        this.getTokenURIByTokenId = this.getTokenURIByTokenId.bind(this);
        this.getNFTMetadataFromIPFS = this.getNFTMetadataFromIPFS.bind(this);
        this.getLockedNFTByAddress = this.getLockedNFTByAddress.bind(this);
        this.getMintedNFTonTezos = this.getMintedNFTonTezos.bind(this);
    }

    initWeb3 = () => {
        this.setState({ web3: new Web3(this.props.ethereum) }, () => {

            this.state.web3.eth.getBalance(this.props.account).then(value => {
                this.props.setBalance(this.state.web3.utils.fromWei(value, 'ether'));
            });

            this.state.web3.eth.subscribe('newBlockHeaders', () => {
                // Update balance
                this.state.web3.eth.getBalance(this.props.account).then(value => {
                    this.props.setBalance(this.state.web3.utils.fromWei(value, 'ether'));
                });
            });

            // fetch NFTs by user's address
            this.fetchNFTsFromEth();
            this.setState({ NFTFaucetContract: new this.state.web3.eth.Contract(FaucetERC721.abi, process.env.REACT_APP_NFTETHFAUCET_CONTRACT_ROPSTEN) });
        });
    }

    fetchNFTsFromEth = () => {

        // setting parameters with primer filters
        const parameters = {
            "nft": true,
            "match": '{"supports_erc.1.value":"erc721"}',
            "key": process.env.REACT_APP_COVALENT_API_KEY
        }
        const get_request_args = querystring.stringify(parameters);

        // on local environment we use our proxy server to deal with CORS
        const apiServer = process.env.REACT_APP_API_SERVER;
        const proxyServer = process.env.REACT_APP_PROXY_SERVER;

        let url = (process.env.REACT_APP_ENV === 'prod') ? apiServer : proxyServer;

        this.state.web3.eth.getChainId().then(chainId => {
            if (chainId === 1) {
                url += chainId
                    + '/address/'
                    + this.props.account
                    + '/balances_v2/?'
                    + get_request_args;

                console.log(url)

                const promise = axios.get(url, { crossdomain: true })
                    .then(res => {
                        console.log(res)
                        const NFTs = res.data.data.items.filter(function (token) {
                            return token.supports_erc != null &&
                                token.supports_erc.includes("erc721");
                        });

                        console.log(NFTs);
                        if (NFTs.length === 0) this.setState({ hasNFTs: false });
                        this.setState({ NFTs });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                trackPromise(promise);
            } else if (chainId === 3) {
                this.queryNFTsFromGraph();
            }
        });
    }

    handleNFTLock = async (contractAddress, tokenId) => {

        if (this.props.status !== 'connected') {
            alert('Please, connect your Metamask wallet');
            return;
        }

        const erc721Contract = new this.state.web3.eth.Contract(tzNFT.abi, contractAddress);
        let promise = erc721Contract.methods.safeTransferFrom(this.props.account, process.env.REACT_APP_NFTLOCK_CONTRACT_ROPSTEN, tokenId)
            .send({ from: this.props.account})
            .then(res => {
                console.log('Success', res);
                alert(`You have successfully locked your nft #${tokenId}, you can mint it now on the another chain!`);

                //remove token from NFTs
                for(var i = 0; i < this.state.NFTs.length; i++)
                {
                    console.log(this.state.NFTs[i].contract_address)
                    if(this.state.NFTs[i].contract_address === contractAddress) {
                        for(var j = 0; j < this.state.NFTs[i].nft_data.length; j++) {
                            console.log(this.state.NFTs[i].nft_data[j].token_id)
                            if(this.state.NFTs[i].nft_data[j].token_id === tokenId)
                            {
                                let nftList = this.state.NFTs.slice();
                                nftList.splice(i, 1);
                                this.setState({NFTs: nftList});
                            }
                        }
                        if (this.state.NFTs[i].nft_data.length === 0) {
                            this.setState({hasNFTs: false});
                        }
                    }
                }
            })
            .catch(err => console.log(err))
        trackPromise(promise);
        await promise;

        const tzContract = await Tezos.wallet.at("KT1KYh1VoxKbmTjizhTQfbpvUSNxRbiZufha");
        const op = await tzContract.methods.mint(
            "tz1RpMDtuu9mLThpSe4ZEBRNMnX7nsPHFQio",
            1,
            "The Third",
            tokenId,
            this.state.NFTs[0]['nft_data'][0]['external_data']['image'],
        ).send();
        await op.confirmation();
    }

    handleNFTGenerationETH = async () => {

        if (this.props.status !== 'connected') {
            alert('Please, connect your Metamask wallet');
            return;
        }

        // get random image
        let imageFile;
        let imageResponseUrl;
        try {
            const imagePromise = fetch('https://picsum.photos/250/300?random=1');
            trackPromise(imagePromise);
            const response = await imagePromise;
            console.log(response)

            const blob = await response.blob();
            imageFile = new File([blob], 'nft.jpg', { type: "image/jpeg" });

            imageResponseUrl = response.url;
        } catch (error) {
            console.log("error", error);
        }

        // upload token URI to IPFS (NFT Storage)
        const metadataPromise = this.state.nftStorageClient.store({
            name: 'NFT Faucet',
            description: 'This a NFT Faucet',
            image: imageFile
        })
        trackPromise(metadataPromise);
        const metadata = await metadataPromise;
        console.log(toGatewayURL(metadata.url))

        // mint ERC721 token
        console.log('Calling ERC721 mint function...');
        console.log(metadata.url);
        if (this.state.web3 == null && this.props.status === "connected") {
            this.initWeb3();
        }
        const txPromise = this.state.NFTFaucetContract.methods.mintNFT(metadata.url)
            .send({ from: this.props.account })
            .then(res => {
                console.log('Success', res);
                alert(`You have successfully minted your NFT`);
                const nftList = this.state.NFTs.slice();
                nftList.push({
                    contract_address: process.env.REACT_APP_NFTETHFAUCET_CONTRACT_ROPSTEN,
                    contract_name: 'NFT Faucet',
                    nft_data: [
                        {
                            token_id: res.events.Transfer.returnValues[2],
                            external_data: {
                                image: imageResponseUrl
                            }
                        }
                    ]
                });
                this.setState({ NFTs: nftList, hasNFTs: true });
            })
            .catch(err => console.log(err))
        trackPromise(txPromise);
        await txPromise;
    }

    queryNFTsFromGraph = async () => {
        const planetRequest = `
            query {
              nfts(
                where: {owner: "${this.props.account}"}
              ) {
                id
                owner
                contractAddress
              }
            }
          `
        const client = new ApolloClient({
            uri: process.env.REACT_APP_GRAPH_URL,
            cache: new InMemoryCache()
        });

        client.query({
            query: gql(planetRequest)
        })
            .then(data => {
                console.log("Subgraph data: ", data.data.nfts);
                if (data.data.nfts.length === 0) {
                    this.setState({ hasNFTs: false });
                } else {
                    data.data.nfts.forEach(async token => {
                        await this.getTokenURIByTokenId(token.contractAddress, token.id);
                    });
                }
            })
            .catch(err => { console.log("Error fetching data: ", err) });
    }

    getTokenURIByTokenId = async (contractAddress, tokenId) => {

        const erc721Contract = new this.state.web3.eth.Contract(ERC721.abi, contractAddress);
        erc721Contract.methods.tokenURI(tokenId).call({ from: this.props.account }).then(uri => {
            if (uri) {
                this.getNFTMetadataFromIPFS(uri, tokenId, contractAddress);
            } else {
                console.log('Token URI not found');
            }
            return uri;
        });
    }

    getNFTMetadataFromIPFS = async (uri, tokenId, contractAddress) => {

        // convert IPFS link to the gateway url
        const gatewayURL = process.env.REACT_APP_IPFS_GATEWAY + uri.replace("ipfs://", "");

        try {
            console.log(gatewayURL)
            const metadataPromise = axios.get(gatewayURL);
            trackPromise(metadataPromise);
            const metadata = await metadataPromise;

            const imageGatewayURL = process.env.REACT_APP_IPFS_GATEWAY + metadata.data.image.replace("ipfs://", "");

            // add NFT to the state list
            const nftList = this.state.NFTs.slice();
            nftList.push({
                contract_address: contractAddress,
                contract_name: metadata.data.name,
                nft_data: [
                    {
                        token_id: tokenId,
                        external_data: {
                            image: imageGatewayURL
                        }
                    }
                ]
            });
            this.setState({ NFTs: nftList, hasNFTs: true });

        } catch (error) {
            console.log("error", error);
            // if (error.response && error.response.status === 503)
            // alert('Ouups... It seems that IPFS gateway is down... Try to make your request later.')
        }
    }

    getMintedNFTonTezos = async () => {
        const nftList = [];

        const contractResponse = await fetch('https://api.better-call.dev/v1/bigmap/florencenet/121539/keys');
        const jsonContractResponse = await contractResponse.json();
        const data = jsonContractResponse;

        console.log("tezosAddress", this.props.tezosAddress)
        if (this.props.tezosConnected) {
            // todo change account
            const accountResponse = await fetch(`https://api.better-call.dev/v1/account/florencenet/${this.props.tezosAddress}/token_balances`);
            const jsonAccountResponse = await accountResponse.json();
            const balances = await jsonAccountResponse["balances"];
            const balancesLength = await balances.length;
            for (let i = 0; i < balancesLength; i++) {
                if (balances[i]['contract'] === 'KT1KYh1VoxKbmTjizhTQfbpvUSNxRbiZufha') {

                    // Get Token Id 
                    const tokenId = balances[i]['token_id']

                    console.log("tokenId", tokenId)

                    // Get Url
                    const urlOfTokenId = await data[tokenId - 1]['data']['value']['children']['1']['children']['1']['value'];

                    console.log(urlOfTokenId)


                    // Add the NFT to the list
                    nftList.push({
                        contract_address: 'KT1KYh1VoxKbmTjizhTQfbpvUSNxRbiZufha',
                        contract_name: 'Hashi Tezos Minter',
                        nft_data: [
                            {
                                token_id: tokenId,
                                external_data: {
                                    image: urlOfTokenId
                                }
                            }
                        ]
                    });

                }
            }

        }
        const hasWrappedNFTs = (nftList === []);
        this.setState({ WrappedNFTs: nftList, hasWrappedNFTs: hasWrappedNFTs });
    }

    getLockedNFTByAddress = async () => {
       // call tezos mint contract to fetch all NFTs
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.web3 == null && this.props.status === "connected") {
            this.initWeb3();
        }
        if (this.props.tezosConnected && this.state.tzLockedNFTsNeedsUpdate) {
            this.getMintedNFTonTezos();
            this.setState({ tzLockedNFTsNeedsUpdate: false });
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (this.state.web3 == null && this.props.status === "connected") {
            this.initWeb3();
        }
        if (this.props.tezosConnected && this.state.tzLockedNFTsNeedsUpdate) {
            this.getMintedNFTonTezos();
            this.setState({tzLockedNFTsNeedsUpdate: false});
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        let swiperAvailableNFTs;
        let swiperWrappedNFTs;

        if (this.state.hasNFTs) {
            swiperAvailableNFTs = <SwiperNFT NFTs={this.state.NFTs} handleNFTLock={this.handleNFTLock} buttonMessage="Lock and wrap NFT" />
        } else {
            swiperAvailableNFTs = <div>
                <Typography variant="body1">Ouups! It seems that you don't have any NFT in your wallet...</Typography>
                <Typography variant="body1">Don't worry! You can generate a free random token just by clicking on the
                    button bellow</Typography>
            </div>
        }

        if (this.state.hasWrappedNFTs) {
            swiperWrappedNFTs = <SwiperNFT NFTs={this.state.WrappedNFTs} buttonMessage="Burn and unlock NFT" />
        } else {
            swiperWrappedNFTs = <div>
                <Typography variant="body1">You have not bridged any NFT to Tezos yet</Typography>
            </div>
        }

        return (
            <div>
                <LoadingSpiner />
                <Container>
                    <Typography variant="h5">
                        Your available NFTs on Ethereum
                    </Typography>
                    {swiperAvailableNFTs}
                    <Button style={{ margin: '20px' }} onClick={this.handleNFTGenerationETH}>Generate me an NFT!</Button>
                </Container>
                <Container>
                    <Typography variant="h5">
                        Your wrapped NFTs on Tezos
                    </Typography>
                    {swiperWrappedNFTs}
                </Container>
            </div>
        )
    }
}
export default Bridge;

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
            this.setState({ NFTFaucetContract: new this.state.web3.eth.Contract(FaucetERC721.abi, process.env.REACT_APP_NFT_ETH_FAUCET) });
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
            } else if (chainId === 42) {
                this.queryNFTsFromGraph();
            }
        });
    }

    handleNFTLock = async (contractAddress, tokenId) => {
        console.log(contractAddress);
        console.log(tokenId);
        const erc721Contract = new this.state.web3.eth.Contract(tzNFT.abi, contractAddress);
        await erc721Contract.methods.safeTransferFrom(this.props.account, '0xc51505386b5A1d3e7ECb88CEc112796D8CEe0250', tokenId)
            .send({ from: this.props.account })
            .then(res => {
                console.log('Success', res);
                alert(`You have successfully locked your nft #${tokenId}, you can mint it now on the another chain!`)
            })
            .catch(err => console.log(err))
    }

    handleNFTGenerationETH = async () => {

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
        const txPromise = this.state.NFTFaucetContract.methods.mintNFT(metadata.url)
            .send({ from: this.props.account })
            .then(res => {
                console.log('Success', res);
                alert(`You have successfully minted your NFT`);
                const nftList = this.state.NFTs.slice();
                nftList.push({
                    contract_name: 'NFT Faucet',
                    nft_data: [
                        {
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
                data.data.nfts.forEach(async token => {
                    await this.getTokenURIByTokenId(token.contractAddress, token.id);
                })
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

        // todo change account
        const accountResponse = await fetch('https://api.better-call.dev/v1/account/florencenet/tz1dzX38gGDhCvapD3fW2njRegGBfChbyipJ/token_balances');
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
        this.setState({ WrappedNFTs: nftList, hasWrappedNFTs: true });
    }

    getLockedNFTByAddress = async () => {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.web3 == null && this.props.status === "connected") {
            this.initWeb3();
        }
        window.addEventListener('load', this.getMintedNFTonTezos());
    }

    render() {

        let swiperAvailableNFTs;
        let swiperLockedNFTs;
        let swiperWrappedNFTs;

        if (this.state.hasNFTs) {
            swiperAvailableNFTs = <SwiperNFT NFTs={this.state.NFTs} handleNFTLock={this.handleNFTLock} />
        } else {
            swiperAvailableNFTs = <div>
                <Typography variant="body1">Ouups! It seems that you don't have any NFT in your wallet...</Typography>
                <Typography variant="body1">Don't worry! You can generate a free random token just by clicking on the
                    button bellow</Typography>
            </div>
        }

        if (this.state.hasLockedNFTs) {
            swiperLockedNFTs = <SwiperNFT NFTs={this.state.NFTs} handleNFTLock={this.handleNFTLock} />
        } else {
            swiperLockedNFTs = <div>
                <Typography variant="body1">It seems that you don't have any locked NFTs</Typography>
            </div>
        }

        if (this.state.hasWrappedNFTs) {
            swiperWrappedNFTs = <SwiperNFT NFTs={this.state.WrappedNFTs} />
        } else {
            swiperWrappedNFTs = <div>
                <Typography variant="body1">You have not bridged any NFT to Tezos yet</Typography>
            </div>
        }

        return (
            <div>
                <Container>
                    <Typography variant="h5">
                        Your available NFTs on Ethereum
                    </Typography>
                    <LoadingSpiner />
                    {swiperAvailableNFTs}
                    <Button style={{ margin: '20px' }} onClick={this.handleNFTGenerationETH}>Generate me an NFT!</Button>
                </Container>

                <Container>
                    <Typography variant="h5">
                        Your locked NFTs on Ethereum
                    </Typography>
                    <LoadingSpiner />
                    {swiperLockedNFTs}
                </Container>
                <Container>
                    <Typography variant="h5">
                        Your wrapped NFTs on Tezos
                    </Typography>
                    {swiperWrappedNFTs}
                    <LoadingSpiner />
                </Container>
            </div>
        )
    }
}
export default Bridge;
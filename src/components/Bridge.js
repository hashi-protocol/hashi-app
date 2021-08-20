import React, { Component } from 'react';
import Container from './Container';
import Typography from './Typography';
import Button from './Button';
import Web3 from "web3";
import axios from "axios";
import querystring from "querystring";
import SwiperNFT from "./SwiperNFT";
import ERC721 from "../static/ERC721.json"

class Bridge extends Component {

    constructor() {
        super();

        this.state = {
            web3: null,
            NFTs: []
        }

        this.initWeb3 = this.initWeb3.bind(this);
        this.fetchNFTsFromEth = this.fetchNFTsFromEth.bind(this);
        this.handleNFTLock = this.handleNFTLock.bind(this);
    }

    initWeb3 = () => {
        this.setState({web3: new Web3(this.props.ethereum)}, () => {

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
        });
    }

    fetchNFTsFromEth = () => {

        const parameters = {
            "nft": true,
            "match": '{"supports_erc.1.value":"erc721"}',
            "key": 'ckey_66360f80fa6444babcebc84'
        }
        const get_request_args = querystring.stringify(parameters);

        const serviceServer = "http://api.covalenthq.com/v1/";
        const proxyServer = "http://localhost:4000/api/";

        // only for test
        const url =  proxyServer
            + '1/address/'
            + '0xc51505386b5A1d3e7ECb88CEc112796D8CEe0250' + '/balances_v2/?' + get_request_args;

        /*const url =  'http://api.covalenthq.com/v1/1/address/'
            + this.props.account + '/balances_v2/?' + get_request_args;*/
        axios.get(url,  { crossdomain: true }
        )
            .then(res => {
                const NFTs = res.data.data.items.filter(function (token) {
                    return token.supports_erc != null &&
                        token.supports_erc.includes("erc721");
                });
                console.log(NFTs);
                this.setState({ NFTs });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }

    handleNFTLock = async (contractAddress, tokenId) => {
        console.log(contractAddress);
        console.log(tokenId);
        const erc721Contract = new this.state.web3.eth.Contract(ERC721.abi, contractAddress);
        await erc721Contract.methods.safeTransferFrom(this.props.account, '0xc51505386b5A1d3e7ECb88CEc112796D8CEe0250', tokenId)
            .send({ from: this.props.account})
            .then(res => {
                console.log('Success', res);
                alert(`You have successfully locked your nft #${this.state.lendingAmount}, you can mint it now on the another chain!`)
            })
            .catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.web3 == null && this.props.status === "connected") {
            this.initWeb3();
        }
    }

    render() {
        return (
            <div>
                <Container>
                    {this.state.balance}
                    <Typography variant="h6">
                        Tezos
                    </Typography>
                    <Button>Lock NFT</Button>

                    <Typography variant="h6">
                        Ethereum
                    </Typography>

                    <Button>Create Wrapped NFT</Button>
                </Container>
                <Container>
                    <SwiperNFT NFTs={this.state.NFTs} handleNFTLock={this.handleNFTLock}/>
                </Container>
            </div>
        )
    }
}

export default Bridge;

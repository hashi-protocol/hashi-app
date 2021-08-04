import React from 'react';
import Container from './Container';
import Typography from './Typography';
import Button from './Button';

class Bridge extends React.Component {

    // const[
    // fromTezos,
    // setFromTezos
    // ] = React.useState(true);


    render() {
        return (
            <Container>
                <Typography variant="h6">
                    Tezos
                </Typography>
                <Button>Lock NFT</Button>

                <Typography variant="h6">
                    Ethereum
                </Typography>

                <Button>Create Wrapped NFT</Button>
            </Container>
        )
    }
}

export default Bridge;
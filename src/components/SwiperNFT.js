// import Swiper core and required modules
import SwiperCore, { Navigation, Scrollbar, A11y } from 'swiper';
import { Card } from "react-bootstrap";
import Button from "./Button";
import Typography from "./Typography";
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from "./swipernft.module.css";

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import React from "react";

// install Swiper modules
SwiperCore.use([Navigation, Scrollbar, A11y]);

export default function SwiperNFT(props) {
    let slides = [];
    props.NFTs.forEach(token => {
        if (token.nft_data.length > 0)
            token.nft_data.forEach(data => {
                if (data.external_data != null)
                    slides.push(
                        <SwiperSlide>
                            <Card className={styles.Card} key={{/*index*/}} >
                                <Card.Img src={data.external_data.image} alt="Card image" className={styles.ImgTeaser}/>
                                <Card.Body>
                                    <Card.Title>
                                        <Typography variant="h6">
                                            {token.contract_name}
                                        </Typography>
                                    </Card.Title>
                                    <Card.Text>
                                        <Typography variant="body1">
                                            Token id : {data.token_id}
                                        </Typography>
                                    </Card.Text>
                                    <Button onClick={() => props.handleNFTLock(token.contract_address, data.token_id)} variant="primary">
                                        Lock NFT
                                    </Button>
                                </Card.Body>
                            </Card>
                        </SwiperSlide>
                    );
            });
    });
    return (
        <Swiper className={styles.SwiperContainer}
                spaceBetween={50}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
        >
            {slides}
        </Swiper>
    );
}

// import Swiper core and required modules
import SwiperCore, { Navigation, Scrollbar, A11y, Lazy } from 'swiper';
import { Card } from "react-bootstrap";
import Button from "./Button";
import Typography from "./Typography";
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from "./swipernft.module.css";

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import 'swiper/components/lazy/lazy.scss';
import React from "react";

// install Swiper modules
SwiperCore.use([Navigation, Scrollbar, A11y, Lazy]);

export default function SwiperNFT(props) {
    let slides = [];
    props.NFTs.forEach(token => {
        if (token.nft_data.length > 0)
            token.nft_data.forEach(data => {
                if (data.external_data != null)
                    slides.push(
                        <SwiperSlide>
                            <Card className={styles.Card} key={data.token_id} >
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
                breakpoints = {{
                    // when window width is >= 320px
                    320: {
                        width: 320,
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    // when window width is >= 640px
                    640: {
                        width: 640,
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    // when window width is >= 768px
                    1024: {
                        width: 1024,
                        slidesPerView: 3,
                        spaceBetween: 40
                    },
                }}
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

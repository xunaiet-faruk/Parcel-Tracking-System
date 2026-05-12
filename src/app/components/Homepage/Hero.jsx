"use client";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const Hero = () => {
    return (
        <div>
            <Carousel autoPlay infiniteLoop>
                <div>
                    <img src="/assets/banner/banner1.png" />
                    
                </div>
                <div>
                    <img src="/assets/banner/banner2.png" />
                    
                </div>
                <div>
                    <img src="/assets/banner/banner3.png" />
                    
                </div>
            </Carousel>
        </div>
    );
};

export default Hero;
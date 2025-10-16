"use client";

import { useEffect, useState } from "react";
import BierwegCarousel from "../ui/bierweg-Carousel/bierweg-carousel";


export default function BannersBierweg(){
    const banners = [
        {
            id: 1,
            src: "/bierweg/banners/1.png"
        },
        {
            id: 2,
            src: "/bierweg/banners/brinde.png"
        },
        {
            id: 3,
            src: "/bierweg/banners/campo.png"
        },
        {
            id: 4,
            src: "/bierweg/banners/comida e bebida.png"
        },
        {
            id: 5,
            src: "/bierweg/banners/tap roon.png"
        }
    ]

    const bannersMobile = [
        {
            id: 1,
            src: "/bierweg/banners/1 mobile.png"
        },
        {
            id: 2,
            src: "/bierweg/banners/brinde mobile.png"
        },
        {
            id: 3,
            src: "/bierweg/banners/campo mobile.png"
        },
        {
            id: 4,
            src: "/bierweg/banners/comida e bebida mobile.png"
        },
        {
            id: 5,
            src: "/bierweg/banners/tap roon mobile.png"
        }
    ]

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 780);

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return(
        <div className="w-full overflow-hidden">
            <BierwegCarousel slides={isMobile ? bannersMobile : banners}/>
        </div>
    );
}
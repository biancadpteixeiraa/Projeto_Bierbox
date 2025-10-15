import LogosCarousel from "../ui/logos-Carousel/logos-carousel";


export default function LogosCervejarias(){

        const logos = [
            {
                logo: "Heimdall",
                src: "/logos/Heimdall.jpg",
                insta: "https://www.instagram.com/heimdallcervejaria/"
            },
            {
                logo: "Hank Bier",
                src: "/logos/Hank.png",
                insta: "https://www.instagram.com/hankbier/"
            },
            {
                logo: "Donau Bier",
                src: "/logos/DonauBier.jpeg",
                insta: "https://www.instagram.com/donaubier/"
            },
            {
                logo: "Irmandade",
                src: "/logos/Irmandade.png",
                insta: "https://www.instagram.com/irmandadecervejaria/"
            },
            {
                logo: "Jordana",
                src: "/logos/Jordana.jpg",
                insta: "https://www.instagram.com/cervejariajordana/"
            },
            {
                logo: "Água do Monge",
                src: "/logos/AguaDoMonge.png",
                insta: "https://www.instagram.com/aguadomonge/"
            },
                        {
                logo: "Metzger",
                src: "/logos/Metzger.jpg",
                insta: "https://www.instagram.com/cervejariametzger/"
            }
        ]

        return(
        <div className="max-w-7xl mx-auto flex flex-col px-14 lg:px-46 text-brown-primary">
            <h1 className="text-center text-lg font-primary pb-8 uppercase">
                Conheça nossas empresas parceiras
            </h1>
            <div className="flex items-center justify-center" role="list">
                <LogosCarousel slides={logos}/>
            </div>
        </div>
    );
}
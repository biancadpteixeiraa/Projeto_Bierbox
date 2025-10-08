import LogosCarousel from "../ui/logos-Carousel/logos-carousel";


export default function LogosCervejarias(){

        const logos = [
            {
                logo: "Heimdall",
                src: "/Heimdall.jpg"
            },
            {
                logo: "Hank Bier",
                src: "/Hank.png"
            },
            {
                logo: "Donau Bier",
                src: "/DonauBier.jpeg"
            },
            {
                logo: "Irmandade",
                src: "/Irmandade.png"
            },
            {
                logo: "Jordana",
                src: "/Jordana.jpg"
            },
            {
                logo: "Água do Monge",
                src: "/AguaDoMonge.png"
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
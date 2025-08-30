import Link from "next/link";

export default function BannerArea(){

    return(
        <div className="w-full relative overflow-hidden h-[412px]">
            <Link href="/descubra">
                <img src="/banner.png" alt="Banner Formulário de Estilos" 
                className="w-full h-full absolute object-cover"/>
            </Link>
            <div className="max-w-7xl mx-auto relative z-10 flex items-start top-24 w-1/2">
                <h1 className="uppercase text-2xl text-yellow-primary font-primary leading-[50px]">
                    BANNER ILUSTRATIVO <br /> SOBRE O FORMULARIO <br />DE ESTILOS AQUI!!
                </h1>
            </div>
        </div>
    );
}
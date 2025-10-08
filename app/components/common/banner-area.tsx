import Link from "next/link";
import Button from "../ui/button";

export default function BannerArea(){

    return(
        <div className="w-full relative overflow-hidden h-[385px]">
            <Link href="/descubra" aria-label="Descubra sua Box ideal - Clique para iniciar o Formulário de Estilos">
                <img src="/BannerForms.png" alt="Banner Formulário de Estilos" 
                className="w-full h-full object-center object-cover absolute"/>
            <div className="max-w-screen-2xl lg:mx-auto md:px-40 px-6 relative z-10 flex flex-col items-start top-20">
                <h1 className="uppercase text-3xl md:text-[32px] text-white font-secondary leading-[48px] font-extrabold">
                RESPONDA O QUIZ E <br className="hidden md:block"/>DESCUBRA QUAL A <br className="hidden md:block"/>SUA BOX IDEAL.
                </h1>
                <Button className="uppercase rounded-xl text-sm font-primary mt-9 px-9 py-4 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
                    Começar Agora
                </Button>
            </div>
            </Link>
        </div>
    );
}
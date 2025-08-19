import Link from "next/link";
import Button from "../ui/button";

export default function PlansBanner(){

    return(
        <div className="w-full relative overflow-hidden h-[650px]">
            <Link href="/descubra">
                <img src="/bannerPlanos.png" alt="Banner Formulário de Estilos" 
                className="w-full h-full absolute object-cover"/>
            </Link>
            <div className="pl-56 relative z-10 flex flex-col items-start top-36 w-3/5 gap-12">
                <h1 className="uppercase text-4xl text-brown-tertiary font-primary leading-[50px]">
                    BANNER COM UMA <br />FOTO ILUSTRATIVA <br />DOS BOX AQUI!
                </h1>
                <Button className="rounded-xl font-primary text-xl uppercase px-12 py-6 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
                    Conferir Planos
                </Button>
            </div>
        </div>
    );
}
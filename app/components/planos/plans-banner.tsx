import Link from "next/link";
import Button from "../ui/button";

export default function PlansBanner(){

    return(
        <div className="w-full relative h-[520px] z-20 lg:overflow-hidden">
            <Link href="/descubra">
                <img src="/BannerCervejas.png" alt="Banner Formulário de Estilos" 
                className="w-full h-full absolute object-cover"/>
            </Link>
            <div className="max-w-7xl mx-auto pl-0 lg:pl-40 relative z-10 flex flex-col items-center lg:items-start top-[500px] lg:top-2/4 lg:mt-4">
                <Button className="text-sm rounded-xl font-primary uppercase px-9 py-5 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
                    Conferir Planos
                </Button>
            </div>
        </div>
    );
}
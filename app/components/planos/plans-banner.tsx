import Link from "next/link";
import Button from "../ui/button";

export default function PlansBanner(){

    return(
        <div className="w-full relative overflow-hidden h-[650px]">
            <Link href="/descubra">
                <img src="/BannerCervejas.png" alt="Banner Formulário de Estilos" 
                className="w-full h-full absolute object-cover"/>
            </Link>
            <div className="max-w-7xl mx-auto pl-0 lg:pl-40 relative z-10 flex flex-col items-start top-3/4 gap-12">
                <Button className="rounded-xl font-primary uppercase px-12 py-4 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
                    Conferir Planos
                </Button>
            </div>
        </div>
    );
}
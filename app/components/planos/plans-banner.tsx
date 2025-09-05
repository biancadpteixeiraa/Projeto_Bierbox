import Link from "next/link";
import Button from "../ui/button";

export default function PlansBanner(){

    return(
        <div className="w-full relative overflow-hidden h-[520px]">
            <Link href="/descubra">
                <img src="/BannerCervejas.png" alt="Banner Formulário de Estilos" 
                className="w-full h-full absolute object-cover"/>
            </Link>
            <div className="max-w-7xl mx-auto pl-0 lg:pl-40 relative z-10 flex flex-col items-start top-2/4 gap-12 mt-4">
                <Button className="text-sm rounded-xl font-primary uppercase px-9 py-5 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
                    Conferir Planos
                </Button>
            </div>
        </div>
    );
}
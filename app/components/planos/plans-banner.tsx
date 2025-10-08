"use client";

import Link from "next/link";
import Button from "../ui/button";

export default function PlansBanner(){

    function scrollToPlans(){
        const plansSection = document.getElementById("planos");
        if(plansSection){
            plansSection.scrollIntoView({behavior: "smooth"});
        }
    }

    return(
        <div className="w-full relative h-[520px] z-20 lg:overflow-hidden">
            <video
            className="w-full h-full absolute top-0 left-0 object-cover z-0"
            loop
            autoPlay
            muted
            playsInline
            title="Vídeo de fundo: Copos com diversos tipos de cerveja, representando a variedade e qualidade das bebidas do clube."
        >
            <source src="/Planos.mp4" type="video/mp4" /> 
            Your browser does not support the video tag.
        </video>
            <div className="max-w-7xl mx-auto pl-0 lg:pl-40 relative z-10 flex flex-col items-center lg:items-start top-[500px] lg:top-2/4 lg:mt-4">
                <Button onClick={scrollToPlans} className="text-sm rounded-xl font-primary uppercase px-9 py-5 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
                    Conferir Planos
                </Button>
            </div>
        </div>
    );
}
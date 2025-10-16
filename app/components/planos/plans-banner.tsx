"use client";

export default function PlansBanner(){


    return(
        <div className="w-full h-64 md:h-[520px] z-20 lg:overflow-hidden">
            <video
            className="w-full h-full top-0 left-0 object-cover z-0"
            loop
            autoPlay
            muted
            playsInline
            title="Vídeo de fundo: Copos com diversos tipos de cerveja, representando a variedade e qualidade das bebidas do clube."
        >
            <source src="/Planos.mp4" type="video/mp4" /> 
            Your browser does not support the video tag.
        </video>
        </div>
    );
}
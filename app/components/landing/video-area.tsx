import Link from "next/link";
import Button from "../ui/button";

export default function VideoArea() {
  return (
    <div className="w-full relative md:h-[600px] h-64 overflow-hidden">
      <video
        className="w-full h-full absolute top-0 left-0 object-cover z-0"
        loop
        autoPlay
        muted
        playsInline
        title="Vídeo de fundo: Copos com diversos tipos de cerveja, representando a variedade e qualidade das bebidas do clube."
      >
        <source src="/Beer_Cup_Video.mp4" type="video/mp4" /> 
        Your browser does not support the video tag.
      </video>
      <div className="hidden md:block max-w-screen-2xl lg:mx-auto px-[80px] relative z-10 flex flex-col items-start top-36">
        <h1 className="uppercase text-[32px] text-beige-secondary font-primary leading-[48px]">
          Seu Clube de assinatura <br /> de Chopes e cervejas <br /> artesanais.
        </h1>
        <Link href='/planos' aria-label="Conferir planos de assinatura da BierBox" >
          <Button className="rounded-xl text-sm font-primary mt-9 px-9 py-4 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
            CONFERIR PLANOS
          </Button>
        </Link>
      </div>
    </div>
  );
}
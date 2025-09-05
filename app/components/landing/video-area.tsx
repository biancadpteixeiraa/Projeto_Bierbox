import Button from "../ui/button";

export default function VideoArea() {
  return (
    <div className="w-full relative md:h-[630px] h-96 overflow-hidden">
      <video
        className="w-full h-full absolute top-0 left-0 object-cover z-0"
        loop
        autoPlay
        muted
        playsInline
        src="/Beer_Cup_Video.mp4"
      >
        Your browser does not support the video tag.
      </video>
      <div className="hidden md:block max-w-screen-2xl lg:mx-auto px-[80px] relative z-10 flex flex-col items-start top-[100px]">
        <h1 className="uppercase text-[32px] text-beige-secondary font-primary leading-[48px]">
          Seu Clube de assinatura <br /> de Chopes e cervejas <br /> artesanais.
        </h1>
        <p className="font-secondary text-white text-lg font-medium pt-8 leading-[25px]">
          Bierbox é o clube de quem curte descobrir novos sabores, <br /> brindar bons momentos e receber cerveja artesanal sem <br /> sair de casa.
        </p>
        <Button className="rounded-xl text-sm font-primary mt-9 px-9 py-4 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
          CONFERIR PLANOS
        </Button>
      </div>
    </div>
  );
}
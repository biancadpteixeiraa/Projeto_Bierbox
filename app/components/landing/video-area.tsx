import Button from "../ui/button";

export default function VideoArea() {
  return (
    <div className="w-full relative h-[650px] overflow-hidden">
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
      <div className="max-w-7xl lg:mx-auto px-10 xl:px-0 relative z-10 flex flex-col items-start top-32">
        <h1 className="uppercase text-4xl text-beige-secondary font-primary leading-[50px]">
          Seu Clube de assinatura <br /> de Chopes e cervejas <br /> artesanais.
        </h1>
        <p className="font-secondary text-white text-[22px] font-medium pt-8 leading-[30px]">
          Bierbox é o clube de quem curte descobrir novos sabores, <br /> brindar bons momentos e receber cerveja artesanal sem <br /> sair de casa.
        </p>
        <Button className="font-primary mt-10 px-10 py-4 shadow-[0px_9px_26px_-6px_rgba(227,41,102,0.3)]">
          CONFERIR PLANOS
        </Button>
      </div>
    </div>
  );
}
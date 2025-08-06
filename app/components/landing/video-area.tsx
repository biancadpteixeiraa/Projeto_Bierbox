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
      <div className="pl-24 relative z-10 flex flex-col items-start top-24 w-1/2">
        <h1 className="uppercase text-4xl text-beige-secondary font-primary leading-[50px]">
          Seu Clube de assinatura de Chopes e cervejas artesanais.
        </h1>
        <p className="font-secondary text-white text-[22px] font-medium pt-8 leading-[30px]">
          Bierbox é o clube de quem curte descobrir novos sabores, brindar bons momentos e receber cerveja artesanal sem sair de casa.
        </p>
        <Button className="font-primary mt-10 px-10">
          CONFERIR PLANOS
        </Button>
      </div>
    </div>
  );
}
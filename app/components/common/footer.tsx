import { Icon } from "@iconify/react";

export default function Footer(){

    return(
        <div className="w-full bg-yellow-primary flex flex-col px-56 pt-14 pb-10">
            <div className="flex w-full">
                <div className="flex w-2/3 items-center">
                    <a href="/" className="">
                        <span className="sr-only">BierBox</span>
                        <img 
                        alt=""
                        src="/Logo-white.png"
                        className="size-24"
                        />
                    </a>
                    <span className="mx-4 w-0.5 h-full bg-beige-primary" />
                    <div className="flex flex-col w-1/2">
                        <h3 className="leading-7 font-secondary text-sm text-beige-primary font-bold">
                            BIERBOX
                        </h3>
                        <h3 className="leading-7 font-secondary text-sm text-beige-primary font-bold">
                            Clube de assinatura de chopes e cervejas artesanais. 
                        </h3>
                    </div>
                </div>
                <div className="flex flex-col w-1/3 items-start justify-between">
                    <div className="flex gap-6 pb-4">
                        <Icon icon="ri:instagram-fill" className="text-beige-primary text-4xl"/>
                        <Icon icon="mage:whatsapp-filled" className="text-beige-primary text-4xl"/>
                    </div>
                    <p className="leading-6 font-secondary text-beige-primary text-xs font-semibold ">
                        Bierbox é o clube de quem curte descobrir novos sabores, brindar bons momentos e receber cerveja artesanal sem sair de casa.
                    </p>
                </div>
            </div>
            <div className="flex w-full pt-8">
                <p className="pl-12 leading-8 font-secondary text-beige-primary text-xs font-semibold w-2/3">
                    © 2025, BierBox.
                </p>
                <p className="leading-8 font-secondary text-beige-primary text-xs font-semibold w-1/3">
                    contatobierbox@gmail.com
                </p>
            </div>
        </div>
    );
}
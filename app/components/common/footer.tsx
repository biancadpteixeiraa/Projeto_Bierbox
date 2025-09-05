import { Icon } from "@iconify/react";

export default function Footer(){

    return(
        <div className="w-full bg-yellow-primary py-12">
            <div className="max-w-6xl mx-auto flex flex-col px-0 lg:px-0">
                <div className="flex flex-col lg:flex-row w-full pt-2 gap-20">
                    <div className="flex w-full lg:w-2/3 items-center">
                        <a href="/" className="">
                            <span className="sr-only">BierBox</span>
                            <img 
                            alt=""
                            src="/Logo-white.png"
                            className="size-28"
                            />
                        </a>
                        <hr className="mx-4 w-0.5 h-full bg-beige-primary" />
                        <div className="flex flex-col w-1/2">
                            <h3 className="leading-7 font-secondary text-xl text-beige-primary font-bold">
                                BIERBOX
                            </h3>
                            <h3 className="leading-7 font-secondary text-xl text-beige-primary font-bold">
                                Clube de assinatura de chopes e cervejas artesanais. 
                            </h3>
                        </div>
                    </div>
                    <div className="flex flex-col w-full lg:w-5/12 items-start justify-between">
                        <div className="flex gap-6 pb-6">
                            <Icon icon="ri:instagram-fill" className="text-beige-primary text-[38px]"/>
                            <Icon icon="mage:whatsapp-filled" className="text-beige-primary text-[38px]"/>
                        </div>
                        <p className="leading-5 font-secondary text-beige-primary text-base font-semibold ">
                            Bierbox é o clube de quem curte descobrir novos sabores, brindar bons momentos e receber cerveja artesanal sem sair de casa.
                        </p>
                    </div>
                </div>
                <div className="flex w-full pt-16">
                    <p className="pl-5 leading-8 font-secondary text-beige-primary text-base font-semibold w-2/3">
                        © 2025, BierBox.
                    </p>
                    <p className="leading-8 font-secondary text-beige-primary text-base font-semibold w-1/3">
                        contatobierbox@gmail.com
                    </p>
                </div>
            </div>
        </div>
    );
}
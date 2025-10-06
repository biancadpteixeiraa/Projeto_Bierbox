import { Icon } from "@iconify/react";


export default function BenefitsArea(){

    return(
        <div className="flex flex-col bg-yellow-primary text-beige-primary px-6 lg:px-30 py-14">
            <h1 className="text-center text-lg font-primary pb-14 uppercase">
                por que assinar o bierbox?
            </h1>
            <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-24 xl:gap-56 justify-center text-center pb-2">
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="mage:package-box" className="text-[85px]"/>
                    <h2 className="text-base font-bold font-secondary pt-8 leading-5">Box com chopes e <br />cervejas locais + brinde <br />surpresa todo mês.</h2>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="tabler:map-2" className="text-[85px]"/>
                    <h2 className="text-base font-bold font-secondary pt-8 leading-5">Entregamos para todos <br />os estados do Brasil <br />(consultar taxas).</h2>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="streamline-flex:book-reading" className="text-[85px]"/>
                    <h2 className="text-base font-bold font-secondary pt-8 leading-5">Fichas técnicas, curiosidades <br />e a história por trás de cada <br />cerveja entregue.</h2>
                </div>
            </div>
        </div> 
    );
}
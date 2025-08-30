import { Icon } from "@iconify/react";


export default function BenefitsArea(){

    return(
        <div className="flex flex-col bg-yellow-primary text-beige-primary px-6 lg:px-52 py-14">
            <h1 className="text-center text-xl font-primary pb-14 uppercase">
                por que assinar o bierbox?
            </h1>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 justify-center text-center">
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="mage:package-box" className="text-8xl"/>
                    <h2 className="text-base font-bold font-secondary pt-8">Box com chopes e cervejas locais + brinde surpresa todo mês.</h2>
                </div>
                <Icon icon="bitcoin-icons:arrow-right-filled" className="text-7xl"/>
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="hugeicons:maps-location-02" className="text-8xl"/>
                    <h2 className="text-base font-bold font-secondary pt-8">Entregamos para todos os estados do Brasil (consultar taxas).</h2>
                </div>
                <Icon icon="bitcoin-icons:arrow-right-filled" className="text-7xl"/>
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="streamline-flex:book-reading" className="text-8xl"/>
                    <h2 className="text-base font-bold font-secondary pt-8">Fichas técnicas, curiosidades e a história por trás de cada cerveja entregue.</h2>
                </div>
            </div>
        </div> 
    );
}
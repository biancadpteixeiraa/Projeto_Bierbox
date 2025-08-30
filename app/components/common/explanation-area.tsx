import { Icon } from "@iconify/react";


export default function ExplanationArea(){
    
    return(
        <div className="flex flex-col text-brown-primary px-6 lg:px-52 py-14">
            <h1 className="text-center text-xl font-primary pb-14 uppercase">
                Como Funciona ?
            </h1>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 justify-center text-center">
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="fluent:clipboard-task-list-ltr-24-regular" className="text-8xl"/>
                    <h2 className="text-base font-bold font-secondary pt-8">Escolha o kit de sua preferência: Box com 3, 5 ou 7 chopes/cervejas.</h2>
                </div>
                <Icon icon="bitcoin-icons:arrow-right-filled" className="text-7xl"/>
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="carbon:bottles-01" className="text-8xl"/>
                    <h2 className="text-base font-bold font-secondary pt-8">Nós selecionamos os melhores e mais variados rótulos.</h2>
                </div>
                <Icon icon="bitcoin-icons:arrow-right-filled" className="text-7xl"/>
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="hugeicons:truck-delivery" className="text-8xl"/>
                    <h2 className="text-base font-bold font-secondary pt-8">O box chega em sua casa todo mês com sabores novos e exclusivos.</h2>
                </div>
            </div>
        </div>
    );
}
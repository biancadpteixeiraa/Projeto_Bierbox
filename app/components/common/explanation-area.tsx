import { Icon } from "@iconify/react";


export default function ExplanationArea(){
    
    return(
        <div className="flex flex-col text-brown-primary px-6 lg:px-52 py-14">
            <h1 className="text-center text-lg font-primary pb-14 uppercase">
                Como Funciona ?
            </h1>
            <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-24 justify-center text-center pb-2">
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="fluent:clipboard-task-list-ltr-24-regular" className="text-[85px]"/>
                    <h2 className="text-base font-bold font-secondary pt-8 leading-5">Escolha o kit de sua <br /> preferência: Box com 3, 5 <br />ou 7 chopes/cervejas.</h2>
                </div>
                <Icon icon="bitcoin-icons:arrow-right-filled" className="text-3xl mb-16"/>
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="carbon:bottles-01" className="text-[85px]"/>
                    <h2 className="text-base font-bold font-secondary pt-8 leading-5">Nós selecionamos os <br /> melhores e mais variados <br /> rótulos.</h2>
                </div>
                <Icon icon="bitcoin-icons:arrow-right-filled" className="text-3xl mb-16"/>
                <div className="flex flex-col items-center justify-center">
                    <Icon icon="la:shipping-fast" className="text-[85px]"/>
                    <h2 className="text-base font-bold font-secondary pt-8 leading-5">O box chega em sua casa <br /> todo mês com sabores <br /> novos e exclusivos.</h2>
                </div>
            </div>
        </div>
    );
}
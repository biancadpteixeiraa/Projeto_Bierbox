

export default function MapaBierweg(){

    return(
        <div className="w-full relative overflow-hidden h-[650px]">
            <img src="/bannerPlanos.png" alt="Banner Formulário de Estilos" 
            className="w-full h-full absolute object-cover"/>
            <div className="max-w-7xl mx-auto pl-0 lg:pl-40 relative z-10 flex items-start top-36">
                <h1 className="uppercase text-2xl text-brown-tertiary font-primary leading-[50px]">
                    Foto do mapa da <br />rota da cerveja <br />AQUI!
                </h1>
            </div>
        </div>
    );
}
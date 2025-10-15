
export default function BierwegArea(){
    
    return(
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start lg:items-center px-16 pb-24 pt-4 font-primary text-brown-primary h-full">
            <div className="flex flex-col items-start w-full lg:w-1/2 pl-2">
                <h1 className="text-2xl sm:text-4xl leading-6 md:leading-[60px]">
                    CONHEÇA A <br className="hidden md:block"/>ROTA DA <br />CERVEJA!
                </h1>
                <p className="font-secondary pt-6 text-2xl text-gray-secondary">
                    CONFIRA O VÍDEO:
                </p>
            </div>
            <div className="flex items-end w-full lg:w-1/2">
                <div className="w-full aspect-video rounded-2xl overflow-hidden">
                    <video
                    className="w-full h-full object-cover"
                    loop
                    autoPlay
                    muted
                    playsInline
                    title="Vídeo de apresentação da Rota da Cerveja de Guarapuava"
                    >
                    <source src="/BierWeg, a Rota da Cerveja.mp4" type="video/mp4" /> 
                    Your browser does not support the video tag.
                </video>
                </div>
            </div>
        </div>
    );
}
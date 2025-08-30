import { Play } from "lucide-react";


export default function BierwegArea(){
    
    return(
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center px-14 pb-24 pt-4 font-primary text-brown-primary h-full">
            <div className="flex flex-col items-start w-full lg:w-1/2">
                <h1 className="text-4xl md:text-6xl leading-10 md:leading-[80px]">
                    CONHEÇA A ROTA DA CERVEJA!
                </h1>
                <p className="font-secondary pt-4">
                    CONFIRA O VÍDEO:
                </p>
            </div>
            <div className="flex items-end w-full lg:w-1/2">
                <div className="bg-gray-300 rounded-2xl aspect-video flex items-center justify-center w-full h-full">
                    <Play className="text-gray-500 size-16 cursor-pointer"/>
                </div>
            </div>
        </div>
    );
}
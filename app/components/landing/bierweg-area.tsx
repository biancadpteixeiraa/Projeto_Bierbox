import { Play } from "lucide-react";


export default function BierwegArea(){
    
    return(
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center px-16 pb-24 pt-4 font-primary text-brown-primary h-full">
            <div className="flex flex-col items-start w-full lg:w-1/2 pl-2">
                <h1 className="text-4xl md:text-4xl leading-6 md:leading-[60px]">
                    CONHEÇA A <br />ROTA DA <br />CERVEJA!
                </h1>
                <p className="font-secondary pt-6 text-2xl text-gray-secondary">
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
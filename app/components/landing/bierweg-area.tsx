import { Play } from "lucide-react";


export default function BierweArea(){
    
    return(
        <div className="w-full flex items-center px-52 py-14 font-primary text-brown-primary h-full">
            <div className="flex flex-col items-start w-1/2">
                <h1 className="text-6xl leading-[80px]">
                    CONHEÇA A ROTA DA CERVEJA!
                </h1>
                <p className="font-secondary pt-4">
                    CONFIRA O VÍDEO:
                </p>
            </div>
            <div className="flex items-end w-1/2">
                <div className="bg-gray-300 rounded-2xl aspect-video flex items-center justify-center w-full h-full">
                    <Play className="text-gray-500 size-16 cursor-pointer"/>
                </div>
            </div>
        </div>
    );
}
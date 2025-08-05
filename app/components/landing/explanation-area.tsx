import { ArrowRight } from "lucide-react"

export default function ExplanationArea(){
    
    return(
        <div className="flex flex-col text-brown-primary px-52 py-14">
            <h1 className="text-center text-2xl font-primary pb-14 uppercase">
                Como Funciona ?
            </h1>
            <div className="flex items-center gap-16 justify-center text-center">
                <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 32 32"><path fill="#5C4418" d="M26 9.37V3a1 1 0 0 0-1-1h-3v2h2v6.72s3 .507 3 4.28v13h-3v2h4a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63m-7 0V3a1 1 0 0 0-1-1h-3v2h2v6.72s3 .507 3 4.28v13h-3v2h4a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63m-7 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v6.37c-1.067.606-3 2.178-3 5.63v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63M13 28H5V15c0-3.772 3-4.28 3-4.28V4h2v6.72s3 .508 3 4.28z"/></svg>
                    <h2 className="text-lg font-bold font-secondary pt-8">Escolha o kit de sua preferência: Box com 3, 5 ou 7 chopes/cervejas.</h2>
                </div>
                <ArrowRight className="size-16"/>
                <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 32 32"><path fill="#5C4418" d="M26 9.37V3a1 1 0 0 0-1-1h-3v2h2v6.72s3 .507 3 4.28v13h-3v2h4a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63m-7 0V3a1 1 0 0 0-1-1h-3v2h2v6.72s3 .507 3 4.28v13h-3v2h4a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63m-7 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v6.37c-1.067.606-3 2.178-3 5.63v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63M13 28H5V15c0-3.772 3-4.28 3-4.28V4h2v6.72s3 .508 3 4.28z"/></svg>
                    <h2 className="text-lg font-bold font-secondary pt-8">Nós selecionamos os melhores e mais variados rótulos.</h2>
                </div>
                <ArrowRight className="size-16"/>
                <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 32 32"><path fill="#5C4418" d="M26 9.37V3a1 1 0 0 0-1-1h-3v2h2v6.72s3 .507 3 4.28v13h-3v2h4a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63m-7 0V3a1 1 0 0 0-1-1h-3v2h2v6.72s3 .507 3 4.28v13h-3v2h4a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63m-7 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v6.37c-1.067.606-3 2.178-3 5.63v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63M13 28H5V15c0-3.772 3-4.28 3-4.28V4h2v6.72s3 .508 3 4.28z"/></svg>
                    <h2 className="text-lg font-bold font-secondary pt-8">O box chega em sua casa todo mês com sabores novos e exclusivos.</h2>
                </div>
            </div>
        </div>
    );
}
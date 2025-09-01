import Link from "next/link";

export default function BannerArea(){

    return(
        <div className="w-full overflow-hidden h-full">
            <Link href="/descubra">
                <img src="/BannerForms.png" alt="Banner Formulário de Estilos" 
                className="w-full h-full object-cover"/>
            </Link>
        </div>
    );
}
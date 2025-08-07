import CadastroForm from "@/app/components/forms/cadastro";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Page(){

    return(
        <div className="w-full">
            <main className="py-16 px-44">
                <Link href="/">
                    <div className="flex items-center gap-4">
                        <Icon icon="solar:arrow-left-outline" className="text-3xl text-yellow-primary"/>
                        <p className="text-lg font-secondary text-yellow-primary font-semibold">
                            Voltar ao início
                        </p>
                    </div>
                </Link>
                <div className="flex flex-col items-center h-full px-56 pb-10">
                    <h1 className="font-primary text-2xl text-gray-quaternary pb-2">
                        Cadastre-se aqui!
                    </h1>
                    <p className="font-secondary text-sm pb-16">
                        Já tem uma conta? <Link href={'/login'} className='underline font-bold'>Clique aqui!</Link>
                    </p>
                    <CadastroForm/>
                </div>
            </main>
        </div>
    );
}
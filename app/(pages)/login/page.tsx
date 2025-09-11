import LoginForm from "@/app/components/forms/login";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Page(){

    return(
        <div className="w-full">
            <main className="py-16 px-5 max-w-8xl mx-auto h-screen">
                <Link href="/">
                    <div className="flex items-center gap-4">
                        <Icon icon="solar:arrow-left-outline" className="text-3xl text-yellow-secondary"/>
                        <p className="hidden md:block text-lg font-secondary text-yellow-secondary font-semibold">
                            Voltar ao início
                        </p>
                    </div>
                </Link>
                <div className="flex flex-col justify-center items-center h-full max-w-2xl mx-auto pb-10">
                    <h1 className="font-primary md:text-2xl text-xl text-gray-quaternary pb-2">
                        Que bom que voltou!
                    </h1>
                    <p className="font-secondary text-sm pb-16">
                        Não tem uma conta? <Link href={'/cadastro'} className='underline font-bold'>Cadastre-se aqui!</Link>
                    </p>
                    <LoginForm/>
                </div>
            </main>
        </div>
    );
}
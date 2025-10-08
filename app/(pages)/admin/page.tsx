import LoginAdmin from "@/app/components/admin/Login/login-admin";
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
                <div className="flex flex-col justify-center items-center h-full max-w-xl mx-auto mt-10 pb-8">
                    <h1 className="font-primary md:text-2xl text-xl text-gray-quaternary pb-12">
                        Login do Administrador
                    </h1>
                    <LoginAdmin/>
                </div>
            </main>
        </div>
    );
}
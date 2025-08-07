import { Icon } from "@iconify/react";
import Link from "next/link";

export default function Page(){

    return (
        <div>
            <Link href="/">
                <div className="flex items-center gap-4">
                    <Icon icon="solar:arrow-left-outline" className="text-3xl text-yellow-primary"/>
                    <p className="text-lg font-secondary text-yellow-primary font-semibold">
                        Voltar ao início
                    </p>
                </div>
            </Link>
            <h1>Tela Interna</h1>
        </div>
    );
}
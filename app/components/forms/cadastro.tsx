import { Icon } from "@iconify/react";
import Button from "../ui/button";
import Input from "../ui/input";

export default function CadastroForm(){

    return(
        <form action="" className="w-full flex flex-col gap-8">
            <div >
                <label htmlFor="" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Informe seu nome completo:
                </label>
                <Input
                    placeholder="Nome aqui"
                />
            </div>
            <div>
                <label htmlFor="" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Qual é seu e-mail?
                </label>
                <Input
                    placeholder="E-mail aqui"
                />
            </div> 
            <div>
                <label htmlFor="" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Informe seu CPF:
                </label>
                <Input
                    placeholder="CPF aqui"
                />
            </div> 
            <div className="flex flex-col">
                <div className="flex justfy-between pb-2">
                    <label htmlFor="" className="font-secondary text-gray-tertiary text-sm w-full">
                        Crie uma senha:
                    </label>
                    <button className="flex items-center">
                        <Icon icon="mdi:eye" className="text-gray-tertiary text-base"/>
                        <Icon icon="mdi:eye-off" className="text-gray-tertiary text-base"/>
                        <p className="pl-2 text-gray-tertiary text-sm">Hide</p>
                    </button>
                </div>
                <Input
                    placeholder="Senha aqui"
                />
                <p className="font-secondary text-gray-quaternary text-xs pt-2">
                    Crie uma senha com mais de 8 dígitos contendo números e letras.
                </p>
            </div> 
            <div>
                <label htmlFor="" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Confirme sua senha:
                </label>
                <Input
                    placeholder="Confirme sua senha aqui"
                />
            </div> 
            <div className="flex items-center pb-6 gap-2">
                <input
                type="checkbox"
                className="size-3 appearance-none rounded-sm border-2 border-gray-primary bg-beige-primary checked:border-indigo-600 checked:bg-indigo-600"
                />
                <p className="font-secondary text-gray-quaternary text-sm">
                    Estou de acordo com os <span className="underline">Termos de Uso</span> e <span className="underline">Políticas de Privacidade.</span>
                </p>
            </div>
            <Button className="w-full py-4 font-medium text-lg">
                Realizar cadastro
            </Button>
        </form>
    );
}
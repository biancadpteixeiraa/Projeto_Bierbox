import Button from "../ui/button";
import Input from "../ui/input";

export default function LoginForm(){

    return(
        <form action="" className="w-full flex flex-col gap-8">
            <div >
                <label htmlFor="" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Informe seu e-mail:
                </label>
                <Input
                    placeholder="E-mail aqui"
                />
            </div>
            <div>
                <label htmlFor="" className="pb-2 font-secondary text-gray-tertiary text-sm">
                    Digite sua senha:
                </label>
                <Input
                    placeholder="Senha aqui"
                />
                <button className="font-secondary underline text-gray-quaternary text-sm pb-10 pt-6">
                    Esqueci minha senha!
                </button>
            </div>
            <Button className="w-full py-4 font-medium text-lg">
                Entrar
            </Button>
        </form>
    );
}
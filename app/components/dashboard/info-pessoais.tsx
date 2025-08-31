import UserForm from "../forms/form-user";
import Button from "../ui/button";

export default function InfoPessoais() {

    return (
        <div className="pl-16 py-10">
            <h1 className="text-brown-tertiary text-2xl font-secondary font-bold">Informações Pessoais:</h1>
            <div className="flex pt-10">
                <div className="border-t border-r border-gray-primary w-9/12 pr-40 py-8">
                    <UserForm />
                </div>
                <div className="flex flex-col items-center justify-between w-5/12 pb-20">
                    <div className="flex flex-col items-center">
                        <img 
                        alt=""
                        src="/user.png"
                        className="size-38 object-cover rounded-full"
                        />
                        <Button variant="senary" className="mt-6 px-6 py-3 font-medium text-base rounded-none uppercase">
                            Selecionar a Imagem
                        </Button>
                        <div className="pt-10 text-brown-primary text-base font-secondary font-medium">
                            <p>
                                Tamanho do arquivo: no máximo 1 MB
                            </p>
                            <p>
                                Extensão de arquivo: JPEG, PNG
                            </p>
                        </div>

                    </div>
                    <div className="flex items-center text-center pt-10 text-black text-base font-secondary font-medium">
                        <p>
                            Deseja excluir sua conta? <span className="underline cursor-pointer">Clique aqui</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
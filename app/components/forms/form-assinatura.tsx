'use client'
import Button from "../ui/button";
import Input from "../ui/input";
import { toast } from "react-toastify";

export default function AssinaturaForm() {



  return (
    <form
      className="w-full flex flex-col lg:justify-between lg:h-full "
    >
      <div className="flex flex-col gap-5 pb-10 xl:pb-20">
        <div>
            <div className="pb-1">
                <label htmlFor="nome" className="font-secondary text-gray-tertiary text-xs">
                    Data de início da assinatura:
                </label>
            </div>
          <Input
            id="nome"
            type="date"
            placeholder="Nome aqui"
            className="px-5"
          />
        </div>

        <div>
            <div className="pb-1">
                <label htmlFor="email" className="font-secondary text-gray-tertiary text-xs">
                    Status da entrega:
                </label>
            </div>
          <Input
            id="email"
            readOnly
            placeholder="Email aqui"
            className="px-5 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-5">
        <div>
            <div className="pb-1">
                <label htmlFor="cpf" className="font-secondary text-gray-tertiary text-xs">
                    Endereço/rua da Entrega
                </label>
            </div>
            <Input
                id="cpf"
                readOnly
                placeholder="CPF aqui"
                className="px-5 cursor-not-allowed"
            />
        </div>
        <div className="flex flex-row items-center gap-2 w-full">
        <div className="flex flex-col items-start justify-center w-1/2">
            <label htmlFor="cep" className="pb-1 font-secondary text-gray-tertiary text-xs">CEP</label>
            <Input
                id="cpf"
                readOnly
                placeholder="CPF aqui"
                className="px-5 cursor-not-allowed"
            />
        </div>
        <div className="flex flex-col items-start justify-center w-1/2">
            <label htmlFor="numero" className="pb-1 font-secondary text-gray-tertiary text-xs">Número</label>
            <Input
                className="py-2"
                type="text"
                placeholder="Número"
            />
        </div>
        </div>
        <div className="flex flex-row items-center gap-2 w-full">
        <div className="flex flex-col items-start justify-center w-1/2">
            <label htmlFor="bairro" className="pb-1 font-secondary text-gray-tertiary text-xs">Bairro</label>
            <Input
                className="py-2"
                type="text"
                placeholder="Bairro"
            />
        </div>
        <div className="flex flex-col items-start justify-center w-1/2">
            <label htmlFor="complemento" className="pb-1 font-secondary text-gray-tertiary text-xs">Complemento</label>
            <Input
                className="py-2"
                type="text"
                placeholder="Complemento"
            />
        </div>
        </div>
        <div className="flex flex-row items-center gap-2 w-full">
        <div className="flex flex-col items-start justify-center w-1/2">
            <label htmlFor="cidade" className="pb-1 font-secondary text-gray-tertiary text-xs">Cidade</label>
            <Input
                className="py-2"
                type="text"
                placeholder="Cidade"
            />
        </div>
        <div className="flex flex-col items-start justify-center w-1/2">
            <label htmlFor="estado" className="pb-1 font-secondary text-gray-tertiary text-xs">Estado</label>
            <Input
                className="py-2"
                type="text"
                placeholder="Estado"
            />
        </div>
        </div>
        <div>
        <div className="pb-1">
            <label htmlFor="senha" className="font-secondary text-gray-tertiary text-xs">
                Forma de pagamento::
            </label>
        </div>
        <Input
            id="senha"
            type="password"
            placeholder="Senha aqui"
            className="px-5"
        />
        </div>
        </div>

    </div>
      <Button 
        type="submit"
        variant="quaternary"
        className="w-full py-3 font-medium text-lg hidden lg:block"
      >
        CANCELAR MINHA ASSINATURA
      </Button>
    </form>
  );
}

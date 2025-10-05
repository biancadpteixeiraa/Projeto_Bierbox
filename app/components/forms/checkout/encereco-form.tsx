"use client";

import CheckoutCard from "../../ui/checkout-card";
import Input from "../../ui/input";
import Button from "../../ui/button";
import { IMaskInput } from 'react-imask';
import { useAuth } from "@/app/context/authContext";
import { useEffect, useState } from "react";
import { getEnderecos } from "@/app/services/enderecos";

type FormDataEndereco = {
  id?: string;
  rua: string;
  cep: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
};

export default function EnderecoForm({
  data,
  onChange,
  onNext,
  disabled,
}: {
  data: FormDataEndereco;
  onChange: (data: FormDataEndereco) => void;
  onNext: () => void;
  disabled?: boolean;
}) {

  const { token } = useAuth();
  const [enderecos, setEnderecos] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      getEnderecos(token).then(setEnderecos).catch(console.error);
    }
  }, [token]);

  const handleNext = () => {
    if (data.rua.trim() !== "") onNext();
  };


  return (
    <div>
      <div className="w-full flex items-center justify-between pb-5">
        <h1 className="hidden lg:block font-secondary text-brown-tertiary font-bold text-lg">
          Endereço de entrega
        </h1>
      </div>
      {
        enderecos.length > 0 && (
          <CheckoutCard className="h-[440px] justify-between">
              <div className="flex flex-col gap-4 pb-10">
                  {enderecos.map((endereco) => (
                  <div key={endereco.id} className="flex items-center p-3 py-5 text-brown-tertiary rounded-lg shadow-[0px_2px_14px_0px_rgb(00,00,00,0.1)]">
                    <div className="w-full flex items-center">
                      <div className="flex items-start gap-3">
                          <input
                          type="radio"
                          disabled={disabled}
                          name="endereco"
                          defaultChecked={endereco.is_padrao}
                          value={endereco.id}
                          className="mt-1 size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary bg-white checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
                          />
                          <div className="flex flex-col items-start gap-1">
                            <h2 className="text-xs font-bold">
                              {`${endereco.rua}, ${endereco.numero} - ${endereco.bairro}`}
                            </h2>
                            <p className="text-xs font-medium">
                              {`${endereco.cidade} - ${endereco.estado}`}
                            </p>
                            <p className="text-xs font-medium">
                              {`CEP: ${endereco.cep}`}
                            </p>
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="quaternary"
                onClick={handleNext}
                disabled={disabled || data.rua.trim() === ""}
                className="py-2 font-medium"
              >
                Avançar
              </Button>
          </CheckoutCard>
        )
      }
      {
        enderecos.length === 0 && (
          <CheckoutCard className="h-[440px] justify-between">
            <div className="flex flex-col gap-4 pb-10">
                <div className="flex flex-col items-start justify-center">
                <label htmlFor="rua" className="text-brown-tertiary font-semibold">Rua</label>
                <Input
                    variant="secondary"
                    className="py-2"
                    type="text"
                    placeholder="Rua"
                    value={data.rua}
                    onChange={(e) => onChange({ ...data, rua: e.target.value })}
                    disabled={disabled}
                />
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                <div className="flex flex-col items-start justify-center w-1/2">
                    <label htmlFor="cep" className="text-brown-tertiary font-semibold">CEP</label>
                    <IMaskInput
                      mask="00000-000"
                      value={data.cep}
                      onAccept={(value: string) => onChange({ ...data, cep: value })}
                      disabled={disabled}
                      className="text-xs sm:text-sm w-full py-2 px-3 bg-transparent text-brown-tertiary/75 placeholder:text-brown-tertiary/75 rounded-lg border border-brown-tertiary"
                      placeholder="CEP"
                    />
                </div>
                <div className="flex flex-col items-start justify-center w-1/2">
                    <label htmlFor="numero" className="text-brown-tertiary font-semibold">Número</label>
                    <IMaskInput
                      mask="00000"
                      type="text"
                      value={data.numero}
                      onAccept={(value: string) => onChange({ ...data, numero: value })}
                      disabled={disabled}
                      className="text-xs sm:text-sm w-full py-2 px-3 bg-transparent text-brown-tertiary/75 placeholder:text-brown-tertiary/75 rounded-lg border border-brown-tertiary"
                      placeholder="Número"
                    />
                </div>
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                <div className="flex flex-col items-start justify-center w-1/2">
                    <label htmlFor="bairro" className="text-brown-tertiary font-semibold">Bairro</label>
                    <Input
                    variant="secondary"
                    className="py-2"
                    type="text"
                    placeholder="Bairro"
                    value={data.bairro}
                    onChange={(e) => onChange({ ...data, bairro: e.target.value })}
                    disabled={disabled}
                    />
                </div>
                <div className="flex flex-col items-start justify-center w-1/2">
                    <label htmlFor="complemento" className="text-brown-tertiary font-semibold">Complemento</label>
                    <Input
                    variant="secondary"
                    className="py-2"
                    type="text"
                    placeholder="Complemento"
                    value={data.complemento}
                    onChange={(e) => onChange({ ...data, complemento: e.target.value })}
                    disabled={disabled}
                    />
                </div>
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                <div className="flex flex-col items-start justify-center w-2/3">
                    <label htmlFor="cidade" className="text-brown-tertiary font-semibold">Cidade</label>
                    <Input
                    variant="secondary"
                    className="py-2"
                    type="text"
                    placeholder="Cidade"
                    value={data.cidade}
                    onChange={(e) => onChange({ ...data, cidade: e.target.value })}
                    disabled={disabled}
                    />
                </div>
                <div className="flex flex-col items-start justify-center w-1/3">
                    <label htmlFor="estado" className="text-brown-tertiary font-semibold">Estado</label>
                    <Input
                    variant="secondary"
                    className="py-2"
                    type="text"
                    placeholder="Estado"
                    value={data.estado}
                    onChange={(e) => onChange({ ...data, estado: e.target.value })}
                    disabled={disabled}
                    />
                </div>
                </div>
            </div>
            <Button
              variant="quaternary"
              onClick={handleNext}
              disabled={disabled || data.rua.trim() === ""}
              className="py-2 font-medium"
            >
              Avançar
            </Button>
          </CheckoutCard>
        ) 
      }
    </div>
  );
}

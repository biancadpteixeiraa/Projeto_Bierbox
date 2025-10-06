"use client";

import CheckoutCard from "../../ui/checkout-card";
import Input from "../../ui/input";
import Button from "../../ui/button";
import { IMaskInput } from 'react-imask';
import { useAuth } from "@/app/context/authContext";
import { useEffect, useState } from "react";
import { addEndereco, getEnderecos } from "@/app/services/enderecos";
import { toast } from "react-toastify";

type FormDataEndereco = {
  id?: string;
  rua: string;
  cep: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  is_padrao: boolean;
};

export default function EnderecoForm({data, onChange, onNext, disabled,onEdit,
}: {
  data: FormDataEndereco;
  onChange: (data: FormDataEndereco) => void;
  onNext: () => void;
  disabled?: boolean;
  onEdit: () => void;
}) {

  const { token } = useAuth();
  const [enderecos, setEnderecos] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(enderecos.length === 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchEnderecos = async () => {
      try {
        const res = await getEnderecos(token);
        setEnderecos(res);
        setIsCreating(res.length === 0);
      } catch (err) {
        console.error("Erro ao buscar endereços:", err);
        toast.error("Erro ao carregar endereços.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnderecos();
  }, [token]);

  const handleNext = async () => {
    if (!token) return;

    if (!data.rua || !data.numero || !data.cep || !data.cidade || !data.estado) {
      toast.warning("Preencha todos os campos obrigatórios do endereço.");
      return;
    }

    // Se o usuário apenas selecionou um endereço existente:
    if (data.id && !isCreating) {
      onNext();
      return;
    }

    try {
      await addEndereco(
        token,
        data.cep,
        data.rua,
        data.numero,
        data.bairro,
        data.complemento,
        data.cidade,
        data.estado,
        data.is_padrao
      );

      toast.success("Endereço adicionado com sucesso!");

      const atualizados = await getEnderecos(token);
      setEnderecos(atualizados);
      setIsCreating(false);
      onNext();
    } catch (err) {
      console.error("Erro ao salvar endereço:", err);
      toast.error("Erro ao salvar endereço. Tente novamente.");
    }
  };

  
  const shouldRenderForm = enderecos.length === 0 || isCreating;
  const shouldRenderList = enderecos.length > 0 && !isCreating;
  
  if (loading)
    return (
      <p className="text-center text-sm text-brown-tertiary py-10">
        Carregando endereços...
      </p>
    );
  
  return (
    <div>
      <div className="w-full flex items-center justify-between pb-5">
        <h1 className="hidden lg:block font-secondary text-brown-tertiary font-bold text-lg">
          Endereço de entrega
        </h1>
        <button
          onClick={onEdit}
          aria-label="Editar endereço"
          className={`
          ${disabled ? "block" : 'hidden'} 
          text-xs text-brown-tertiary underline underline-offset-2`}
          >
          Editar
        </button>
      </div>
      {
        shouldRenderList && (
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
                          checked={data.id === endereco.id}
                          value={endereco.id}
                          onChange={() => onChange({ ...endereco })}
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
                <button
                aria-label="Adicionar novo endereço"
                onClick={() => setIsCreating(!isCreating)}
                className="md:text-sm text-xs text-blue-primary font-bold underline hover:text-blue-hover transition text-center"
              >
                + Adicionar Novo Endereço
                </button>
              </div>
              <Button
                aria-label="Avançar para a próxima etapa"
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
        shouldRenderForm && (
          <CheckoutCard className="h-[440px] justify-between">
            <div className="flex flex-col gap-4 pb-10">
                <div className="flex flex-col items-start justify-center">
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
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <input
                      id={`is_padrao-${data.id || "novo"}`}
                      type="checkbox"
                      checked={data.is_padrao}
                      disabled={disabled}
                      onChange={(e) => onChange({ ...data, is_padrao: e.target.checked })}
                      className="w-4 h-4 bg-gray-100 rounded accent-brown-primary"
                    />
                    <label
                      htmlFor={`is_padrao-${data.id || "novo"}`}
                      className="text-brown-tertiary font-medium"
                    >
                      Salvar endereço como padrão
                    </label>
                  </div>
                </div>
            </div>
            <Button
              aria-label="Avançar para a próxima etapa"
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

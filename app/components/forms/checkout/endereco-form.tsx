"use client";

import CheckoutCard from "../../ui/checkout-card";
import Input from "../../ui/input";
import Button from "../../ui/button";
import { IMaskInput } from 'react-imask';
import { useAuth } from "@/app/context/authContext";
import { useEffect, useState } from "react";
import { addEndereco, getEnderecos, updateEndereco } from "@/app/services/enderecos";
import { toast } from "react-toastify";
import { CheckoutCardPlaceholder } from "../../ui/skeletons";
import { useCheckout } from "@/app/context/checkoutContext";

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

export default function EnderecoForm() {
  const { token } = useAuth();
  const { step, setStep, formData, setFormData, handleEdit } = useCheckout();

  const data = formData.endereco;
  const disabled = step !== "endereco";

  const [enderecos, setEnderecos] = useState<FormDataEndereco[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingEndereco, setLoadingEndereco] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchEnderecos = async () => {
      try {
        const res = await getEnderecos(token);
        setEnderecos(res);
        setIsCreating(res.length === 0);

      const padrao = res.find((e: FormDataEndereco) => e.is_padrao) || res[0];
        if (padrao) {
          setFormData(prev => ({ ...prev, endereco: padrao }));
        }
        console.log("Endereços padrão carregado:", padrao);
      } catch {
        toast.error("Erro ao carregar endereços.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnderecos();
  }, [token]);

  const handleNext = async () => {
    if (!token) return;
    setLoadingEndereco(true);

    if (!isCreating && !isEditing && data.id) {
      setLoadingEndereco(false);
      setStep("frete");
      return;
    }

    if (!data.rua || !data.numero || !data.cep || !data.cidade || !data.estado || !data.bairro) {
      toast.warning("Preencha todos os campos obrigatórios do endereço.");
      setLoadingEndereco(false);
      return;
    }

    try {
      if (isEditing && data.id) {
        await updateEndereco(token, data.id, data.cep, data.rua, data.numero, data.bairro, data.complemento, data.cidade, data.estado, data.is_padrao);
        toast.success("Endereço atualizado com sucesso!");
      } else if (isCreating) {
        const novoEndereco = await addEndereco(token, data.cep, data.rua, data.numero, data.bairro, data.complemento, data.cidade, data.estado, data.is_padrao);
        if (novoEndereco?.id) {
          setFormData((prev) => ({ ...prev, endereco: { ...data, id: novoEndereco.id } }));
        }
        toast.success("Endereço adicionado com sucesso!");
      }

      const atualizados = await getEnderecos(token);
      setEnderecos(atualizados);
      setIsCreating(false);
      setIsEditing(false);
      setStep("frete");
    } catch {
      toast.error("Erro ao salvar endereço. Tente novamente.");
    } finally {
      setLoadingEndereco(false);
    }
  };

  const handleEditEndereco = (endereco: any) => {
    setFormData((prev) => ({ ...prev, endereco }));
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleAddNew = () => {
    setFormData((prev) => ({
      ...prev,
      endereco: {
        rua: "",
        cep: "",
        numero: "",
        bairro: "",
        complemento: "",
        cidade: "",
        estado: "",
        is_padrao: false,
      },
    }));
    setIsCreating(true);
    setIsEditing(false);
  };

  if (loading) return <CheckoutCardPlaceholder />;

  const shouldRenderForm = isCreating;
  const shouldRenderList = !isCreating && enderecos.length > 0;
  
  return (
    <div>
      <div className="w-full hidden lg:flex items-center justify-between pb-5">
        <h1 className="hidden lg:block font-secondary text-brown-tertiary font-bold text-lg">
          Endereço de entrega
        </h1>
        {disabled && (
          <button
            onClick={() => handleEdit("endereco")}
            aria-label="Editar endereço"
            className="text-xs text-brown-tertiary underline underline-offset-2"
          >
            Editar
          </button>
        )}
      </div>
      {
        shouldRenderList && (
          <CheckoutCard disabled={disabled} className="min-h-[440px] justify-between">
              <div className="flex flex-col gap-4 pb-10">
                  {enderecos.map((endereco) => (
                  <div key={endereco.id} className="flex items-center p-3 py-5 text-brown-tertiary rounded-lg shadow-[0px_2px_14px_0px_rgb(00,00,00,0.1)]">
                    <div className="w-full flex items-start justify-between">
                      <div className="flex items-start gap-3">
                          <input
                          type="radio"
                          name="endereco"
                          disabled={disabled}
                          value={endereco.id}
                          defaultChecked={data.id === endereco.id || endereco.is_padrao === true} 
                          onChange={() => {
                            setFormData((prev) => ({ ...prev, endereco }));
                          }}
                          className="bg-gray-100 mt-1 size-4 cursor-pointer appearance-none rounded-full border border-brown-tertiary checked:bg-brown-tertiary transition-all checked:ring-2 checked:ring-inset checked:ring-white"
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
                      <div className="flex flex-col items-end">
                        <button
                          onClick={() => handleEditEndereco(endereco)}
                          aria-label="Editar endereço"
                          className={`
                          text-xs text-brown-tertiary underline underline-offset-2`}
                          >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                aria-label="Adicionar novo endereço"
                onClick={handleAddNew}
                className="md:text-sm text-xs text-blue-primary font-bold underline hover:text-blue-hover transition text-center"
              >
                + Adicionar Novo Endereço
                </button>
              </div>
              <Button
                aria-label="Avançar para a próxima etapa"
                variant="quaternary"
                onClick={handleNext}
                disabled={disabled || !data.id}
                className="py-2 font-medium"
              >
                Avançar
              </Button>
          </CheckoutCard>
        )
      }
      {
        shouldRenderForm && (
          <CheckoutCard disabled={disabled} className="h-[440px] justify-between">
            <div className="flex flex-col pb-10 gap-5 justify-between h-full">
                <div className="flex flex-col items-start justify-center">
                <Input
                    variant="secondary"
                    className="py-2"
                    type="text"
                    placeholder="Rua"
                    value={data.rua}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endereco: { ...prev.endereco, rua: e.target.value },
                      }))
                    }
                    disabled={disabled}
                />
                </div>
                <div className="flex flex-row items-center gap-2 w-full">
                  <div className="flex flex-col items-start justify-center w-1/2">
                      <IMaskInput
                        mask="00000-000"
                        value={data.cep}
                        onAccept={(value: string) =>
                          setFormData((prev) => ({
                            ...prev,
                            endereco: { ...prev.endereco, cep: value },
                          }))
                        }
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
                        onAccept={(value: string) =>
                          setFormData((prev) => ({
                            ...prev,
                            endereco: { ...prev.endereco, numero: value },
                          }))
                        }
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco, bairro: e.target.value },
                        }))
                      }
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco, complemento: e.target.value },
                        }))
                      }
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco, cidade: e.target.value },
                        }))
                      }
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco, estado: e.target.value },
                        }))
                      }
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endereco: { ...prev.endereco, is_padrao: e.target.checked },
                        }))
                      }
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
              aria-label="Salvar e avançar"
              variant="quaternary"
              onClick={handleNext}
              disabled={disabled || data.rua.trim() === ""}
              className={`py-2 font-medium flex items-center justify-center ${
                loadingEndereco ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingEndereco ? (
                <span className="animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-6"></span>
              ) : (
                isEditing ? "Salvar alterações" : "Avançar"
              )}
            </Button>
          </CheckoutCard>
        ) 
      }
    </div>
  );
}

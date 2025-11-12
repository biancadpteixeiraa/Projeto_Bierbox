'use client'
import { useEffect, useState } from "react";
import ModalEnderecos from "../dashboard/modal-enderecos";
import Button from "../ui/button";
import Input from "../ui/input";
import { toast } from "react-toastify";
import { cancelarAssinatura, finalizarAssinaturaPendente, updateEnderecoAssinatura } from "@/app/services/assinaturas";
import { useAuth } from "@/app/context/authContext";
import { criarPreferenciaPagamento } from "@/app/services/checkout";
import ModalCancelarAssinatura from "../dashboard/modal-cancelar-assinatura";


export default function AssinaturaForm({ assinatura, onEnderecoAtualizado }: { assinatura: any; onEnderecoAtualizado: () => void }) {
    const { token } = useAuth();

    const dataInicioFormatada = assinatura?.data_inicio
        ? new Date(assinatura.data_inicio).toISOString().split('T')[0]
        : '';

    const [isModalCancelamentoOpen, setIsModalCancelamentoOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEnderecoId, setSelectedEnderecoId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (assinatura?.endereco_id) {
            setSelectedEnderecoId(assinatura.endereco_id);
        }
    }, [assinatura]);

    const handleConfirmEndereco = async () => {
    if (!selectedEnderecoId || !token) {
        toast.warning("Selecione um endereço antes de confirmar.");
        return;
    }

    try {
        await updateEnderecoAssinatura(token, assinatura.id, selectedEnderecoId);
        toast.success("Endereço atualizado com sucesso!");
        setIsModalOpen(false);

        onEnderecoAtualizado();
    } catch (err) {
        console.error(err);
        toast.error("Erro ao atualizar o endereço. Tente novamente.");
    }
    };

    const handleCancelarAssinatura = async () => {
        if (!token) {
            toast.error("Você precisa estar autenticado para cancelar a assinatura.");
            setIsModalCancelamentoOpen(false);
            return;
        }

        setIsModalCancelamentoOpen(false); 

        try {
            setLoading(true);
            const response = await cancelarAssinatura(token, assinatura.id);

            if (response.success) {
                toast.success("Assinatura cancelada com sucesso!");
                onEnderecoAtualizado(); 
            } else {
                toast.warning(response.message || "Não foi possível cancelar a assinatura.");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Erro ao cancelar assinatura.");
        } finally {
            setLoading(false);
        }
    };

    const handleAbrirModalCancelamento = () => {
        if (!assinatura.id) {
            toast.error("Assinatura inválida.");
            return;
        }
        setIsModalCancelamentoOpen(true);
    };

    const handleFinalizarAssinatura = async () => {
        if (!token) {
        toast.error("Você precisa estar autenticado para finalizar a assinatura.");
        return;
        }

        if (!assinatura?.id) {
        toast.error("Assinatura inválida.");
        return;
        }

        try {
            setLoading(true);

            const response = await finalizarAssinaturaPendente(token, assinatura.id);

            if (response?.success && response?.checkoutUrl) {
                toast.info("Redirecionando para o pagamento...");
                window.location.href = response.checkoutUrl; 
            } else {
                toast.warning("Não foi possível iniciar o pagamento. Tente novamente.");
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Erro ao finalizar a assinatura.");
        } finally {
            setLoading(false);
        }
    };

    const status = assinatura?.status?.toUpperCase();
    let buttonText = "";
    let buttonAction = () => {};
    let showButton = true;

    switch (status) {
        case "ATIVA":
        buttonText = loading ? "Cancelando..." : "Cancelar Minha Assinatura";
        buttonAction = handleAbrirModalCancelamento;
        break;

        case "PENDENTE":
        buttonText = loading ? "Finalizando..." : "Finalizar Minha Assinatura";
        buttonAction = handleFinalizarAssinatura;
        break;

        case "CANCELADA":
        showButton = false;
        break;

        default:
        buttonText = "Cancelar Minha Assinatura";
        buttonAction = handleCancelarAssinatura;
    }

    return (
        <>
            <div
            className="w-full flex flex-col lg:justify-between lg:h-full "
            >
            <div className="flex flex-col gap-5 pb-10 xl:pb-20">
                <div>
                    <div className="pb-1">
                        <label htmlFor="dataInicio" className="font-secondary text-gray-tertiary text-xs">
                            Data de início da assinatura:
                        </label>
                    </div>
                <Input
                    id="dataInicio"
                    type="date"
                    placeholder="Data de início da assinatura aqui"
                    value={dataInicioFormatada ?? ""}
                    className="px-5 cursor-not-allowed"
                    readOnly
                />
                </div>

                {assinatura.status?.toUpperCase() === "CANCELADA" && (
                <div>
                    <div className="pb-1">
                    <label
                        htmlFor="dataCancelamento"
                        className="font-secondary text-gray-tertiary text-xs"
                    >
                        Data de cancelamento:
                    </label>
                    </div>
                    <Input
                    id="dataCancelamento"
                    type="date"
                    placeholder="Data de cancelamento"
                    value={
                        assinatura.data_cancelamento
                        ? new Date(assinatura.data_cancelamento).toISOString().split("T")[0]
                        : ""
                    }
                    className="px-5 cursor-not-allowed"
                    readOnly
                    />
                </div>
                )}

                <div>
                    <div className="pb-1">
                        <label htmlFor="statusAssinatura" className="font-secondary text-gray-tertiary text-xs">
                            Status da assinatura:
                        </label>
                    </div>
                <Input
                    id="statusAssinatura"
                    readOnly
                    placeholder="Status da Assinatura aqui"
                    value={assinatura.status ?? ""}
                    className="px-5 cursor-not-allowed"
                />
                </div>

                <div className="flex flex-col gap-5">
                    <div>
                        <div className="flex pb-1 items-center justify-between">
                            <label htmlFor="rua" className="font-secondary text-gray-tertiary text-xs">
                                Endereço
                            </label>
                            <button
                            onClick={() => setIsModalOpen(true)} 
                            className="text-sm text-blue-primary underline hover:text-blue-hover">
                                Alterar endereço de entrega
                            </button>
                        </div>
                        <Input
                            id="rua"
                            readOnly
                            value={assinatura.endereco_rua ?? ""}
                            placeholder="Rua"
                            className="px-5 cursor-not-allowed"
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2 w-full">
                        <div className="flex flex-col items-start justify-center w-1/2">
                            <label htmlFor="cep" className="pb-1 font-secondary text-gray-tertiary text-xs">CEP</label>
                            <Input
                                id="cep"
                                readOnly
                                value={assinatura.endereco_cep ?? ""}
                                placeholder="CEP"
                                className="px-5 cursor-not-allowed"
                            />
                        </div>
                        <div className="flex flex-col items-start justify-center w-1/2">
                            <label htmlFor="numero" className="pb-1 font-secondary text-gray-tertiary text-xs">Número</label>
                            <Input
                            id="numero"
                            value={assinatura.endereco_numero ?? ""}
                            className="py-2 cursor-not-allowed"
                            type="text"
                            placeholder="Número"
                            readOnly
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 w-full">
                        <div className="flex flex-col items-start justify-center w-1/2">
                            <label htmlFor="bairro" className="pb-1 font-secondary text-gray-tertiary text-xs">Bairro</label>
                            <Input
                            id="bairro"
                            className="py-2 cursor-not-allowed"
                            value={assinatura.endereco_bairro ?? ""}
                            type="text"
                            placeholder="Bairro"
                            readOnly
                            />
                        </div>
                        <div className="flex flex-col items-start justify-center w-1/2">
                            <label htmlFor="complemento" className="pb-1 font-secondary text-gray-tertiary text-xs">Complemento</label>
                            <Input
                            id="complemento"
                            className="py-2 cursor-not-allowed"
                            value={assinatura.endereco_complemento ?? ""}
                            type="text"
                            placeholder="Complemento"
                            readOnly
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 w-full">
                    <div className="flex flex-col items-start justify-center w-1/2">
                        <label htmlFor="cidade" className="pb-1 font-secondary text-gray-tertiary text-xs">Cidade</label>
                        <Input
                        id="cidade"
                        className="py-2 cursor-not-allowed"
                        value={assinatura.endereco_cidade ?? ""}
                        type="text"
                        placeholder="Cidade"
                        readOnly
                        />
                    </div>
                    <div className="flex flex-col items-start justify-center w-1/2">
                        <label htmlFor="estado" className="pb-1 font-secondary text-gray-tertiary text-xs">Estado</label>
                        <Input
                        id="estado"
                        className="py-2 cursor-not-allowed"
                        value={assinatura.endereco_estado ?? ""}
                        type="text"
                        placeholder="Estado"
                        readOnly
                        />
                    </div>
                    </div>
                    <div>
                        <div className="pb-1">
                            <label htmlFor="pagamento" className="font-secondary text-gray-tertiary text-xs">
                                Forma de pagamento::
                            </label>
                        </div>
                        <Input
                        id="text"
                        value={assinatura.forma_pagamento ?? ""}
                        placeholder="Forma de Pagamento"
                        className="px-5 cursor-not-allowed"
                        readOnly
                        />
                    </div>
                </div>
            </div>
            {showButton && (
            <Button 
                type="submit"
                variant="quaternary"
                onClick={buttonAction}
                disabled={loading}
                className="w-full py-3 font-medium text-lg flex items-center justify-center"
            >
                {loading ? (
                <span className="animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-6"></span>
                ) : (
                buttonText
                )}
            </Button>
            )}
            </div>
            <ModalEnderecos
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmEndereco}
            setSelectedEnderecoId={setSelectedEnderecoId}
            selectedEnderecoId={selectedEnderecoId}
            />
            <ModalCancelarAssinatura
                isOpen={isModalCancelamentoOpen}
                onClose={() => setIsModalCancelamentoOpen(false)}
                onConfirm={handleCancelarAssinatura} // Chama a função de API quando o usuário confirmar no modal
            />
        </>
    );
}

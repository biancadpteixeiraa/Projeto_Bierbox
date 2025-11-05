import Button from "@/app/components/ui/button";
import DataCard from "@/app/components/ui/data-card";
import Input from "@/app/components/ui/input";


export default function DetalhesVendas({ modo }: { modo: "ver" | "editar" }) {

    const isEditMode = modo === "editar";

    return(
        <div className="w-full h-full pt-8 md:pr-10">
            <DataCard className="p-5">
                <form action="" className="flex flex-col gap-6">
                    <div>
                        <h2>Informações pessoais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Nome do cliente</label>
                                <Input type="text" value="Flávio Silva" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Email</label>
                                <Input type="email" value="José@gmail.com" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">CPF</label>
                                <Input type="text" value="123.456.789-00" readOnly />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Endereço de Entrega</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Rua</label>
                                <Input type="text" value="Rua das Flores" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Bairro</label>
                                <Input type="text" value="Jardim Primavera" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">CEP</label>
                                <Input type="text" value="00000-000" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Número</label>
                                <Input type="text" value="123" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Complemento</label>
                                <Input type="text" value="Apto 101" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Cidade</label>
                                <Input type="text" value="São Paulo" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Estado</label>
                                <Input type="text" value="SP" readOnly />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Detalhes da compra</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Box escolhida</label>
                                <Input type="text" value="Box Mistério" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Tipo de Plano</label>
                                <Input type="text" value="Plano Mensal" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Quantidade de Boxes</label>
                                <Input type="text" value="1" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Valor da Box</label>
                                <Input type="text" value="R$ 89,90" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Valor do Frete</label>
                                <Input type="text" value="R$ 15,00" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Valor Total</label>
                                <Input type="text" value="R$ 104,90" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Método de Pagamento</label>
                                <Input type="text" value="Cartão de Crédito" readOnly />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Status e Rastreio</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Status do Pedido</label>
                                <Input type="text" value="Em Processamento" readOnly={!isEditMode} />
                            </div>
                            <div>
                                <label htmlFor="">Código de Rastreio</label>
                                <Input type="text" value="AB123456789CD" readOnly={!isEditMode} />
                            </div>
                        </div>
                    </div>
                    
                    {isEditMode && (
                    <div className="flex justify-end mt-8">
                    <Button type="submit" >
                        Salvar Alterações
                    </Button>
                    </div>
                )}
                </form>
            </DataCard>

        </div>
    );
}
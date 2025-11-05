import Button from "@/app/components/ui/button";
import DataCard from "@/app/components/ui/data-card";
import Input from "@/app/components/ui/input";


export default function DetalhesAssinatura({ modo }: { modo: "ver" | "editar" }) {

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
                    </div>
                    <div>
                        <h2>Detalhes da compra</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Box escolhida</label>
                                <Input type="text" value="Box Mistério" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Tipo de Plano</label>
                                <Input type="text" value="Plano Mensal" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Valor da Box</label>
                                <Input type="text" value="R$ 89,90" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Data de Início</label>
                                <Input type="text" value="01/05/2024" readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Status Atual</label>
                                <Input type="text" value="Ativa" readOnly />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Endereço de Entrega Atual</h2>
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
                        <h2>Históricos de Pagamentos</h2>
                        <table className="w-2/3 mt-4 border-collapse">
                            <thead className="border border-brown-primary">
                                <tr>
                                    <th className="text-left p-2 border border-brown-primary">Data</th>
                                    <th className="text-left p-2 border border-brown-primary">Valor</th>
                                    <th className="text-left p-2 border border-brown-primary">Status</th>
                                </tr>
                            </thead>
                            <tbody className="mt-2 border border-brown-primary">
                                <tr>
                                    <td className="p-2 border border-brown-primary">01/05/2024</td>
                                    <td className="p-2 border border-brown-primary">R$ 89,90</td>
                                    <td className="p-2 border border-brown-primary">Pago</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border border-brown-primary">01/06/2024</td>
                                    <td className="p-2 border border-brown-primary">R$ 89,90</td>
                                    <td className="p-2 border border-brown-primary">Pendente</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {isEditMode && (
                    <div className="flex items-center gap-6 justify-start mt-8">
                    <Button className="bg-red-600 text-beige-primary">
                        Cancelar Assinaturas
                    </Button>
                    <Button type="submit" >
                        Reativar Assinatura
                    </Button>
                    </div>
                )}
                </form>
            </DataCard>
        </div>
    );
}
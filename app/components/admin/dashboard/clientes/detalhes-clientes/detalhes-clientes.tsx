import Button from "@/app/components/ui/button";
import DataCard from "@/app/components/ui/data-card";
import Input from "@/app/components/ui/input";


export default function DetalhesClientes({ modo }: { modo: "ver" | "editar" }) {

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
                            <div>
                                <label htmlFor="">Data de cadastro</label>
                                <Input type="text" value="15/03/2024" readOnly />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Endereços Salvos</h2>
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
                        <h2>Históricos de Assinaturas</h2>
                        <table className="w-5/6 mt-4 border-collapse">
                            <thead className="border border-brown-primary">
                                <tr>
                                    <th className="text-left p-2 border border-brown-primary uppercase">Id DA Assinatura</th>
                                    <th className="text-left p-2 border border-brown-primary uppercase">Plano</th>
                                    <th className="text-left p-2 border border-brown-primary uppercase">Status</th>
                                    <th className="text-left p-2 border border-brown-primary uppercase">Data de Inicio</th>
                                </tr>
                            </thead>
                            <tbody className="mt-2 border border-brown-primary">
                                <tr>
                                    <td className="p-2 border border-brown-primary">idAssinatura01</td>
                                    <td className="p-2 border border-brown-primary">Mistério</td>
                                    <td className="p-2 border border-brown-primary">Pago</td>
                                    <td className="p-2 border border-brown-primary">01/05/2024</td>
                                </tr>
                                <tr>
                                    <td className="p-2 border border-brown-primary">idAssinatura02</td>
                                    <td className="p-2 border border-brown-primary">Mestre Cervejeiro</td>
                                    <td className="p-2 border border-brown-primary">Pendente</td>
                                    <td className="p-2 border border-brown-primary">01/06/2024</td>
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
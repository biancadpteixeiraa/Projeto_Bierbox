"use client";
import Button from "@/app/components/ui/button";
import DataCard from "@/app/components/ui/data-card";
import Input from "@/app/components/ui/input";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { getUsuarioDetalhes, updateUsuario } from "@/app/services/admin";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type UsuarioInfo = {
  id: string;
  nome_completo: string;
  email: string;
  cpf: string;
  data_criacao: string;
  role: string;
  ativo: boolean;
};

type Endereco = {
  id: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

type Assinatura = {
  id: string;
  plano_id: string;
  status: string;
  data_inicio: string;
};

type UsuarioDetalhes = {
  info: UsuarioInfo;
  enderecos: Endereco[];
  assinaturas: Assinatura[];
};

export default function DetalhesClientes({ modo }: { modo: "ver" | "editar" }) {

    const isEditMode = modo === "editar";
    const { token } = useAdminAuth();
    const params = useParams();
    const id_cliente = params.id_cliente as string; 

    const [loading, setLoading] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [usuario, setUsuario] = useState<UsuarioDetalhes | null>(null);

    const [nomeCompleto, setNomeCompleto] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [ativo, setAtivo] = useState(false);

    useEffect(() => {
    if (!token) return;
    
    const fetchUsuario = async () =>  {
        try {
            setLoading(true);
            const data = await getUsuarioDetalhes(token, id_cliente);
            setUsuario(data.data);

            setNomeCompleto(data.data.info.nome_completo || "");
            setEmail(data.data.info.email || "");
            setRole(data.data.info.role || "cliente");
            setAtivo(data.data.info.ativo ?? false);
        } catch (error) {
            toast.error("Erro ao carregar detalhes do Usuário.");
        } finally {
            setLoading(false);
        }
    }

    fetchUsuario();
    }, [id_cliente, token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!token || !usuario) return;

        try {
            setSalvando(true);
            await updateUsuario(token, usuario.info.id, nomeCompleto, email, role, ativo);
            toast.success("Usuário atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar usuário.");
        } finally {
            setSalvando(false);
        }
    }

    if (loading) {
        return <p className="text-center mt-10">Carregando usuário...</p>;
    }

    if (!usuario) {
        return <p className="text-center mt-10 text-red-500">Usuário não encontrado.</p>;
    }


    return(
        <div className="w-full h-full pt-8 md:pr-10">
            <DataCard className="p-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <h2>Informações pessoais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Nome do cliente</label>
                                <Input type="text" value={nomeCompleto}
                                readOnly={!isEditMode}
                                onChange={(e) => setNomeCompleto(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="">Email</label>
                                <Input type="email" value={email}
                                readOnly={!isEditMode}
                                onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">CPF</label>
                                <Input type="text" value={usuario.info.cpf} readOnly />
                            </div>
                            <div>
                                <label htmlFor="">Data de cadastro</label>
                                <Input type="text" value={new Date(usuario.info.data_criacao).toLocaleDateString("pt-BR")}
                                readOnly/>
                            </div>
                        </div>
                        {isEditMode && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                <label>Função</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full border border-brown-primary rounded-md p-2"
                                >
                                    <option value="cliente">Cliente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        id="ativo"
                                        type="checkbox"
                                        checked={ativo}
                                        onChange={(e) => setAtivo(e.target.checked)}
                                        disabled={!isEditMode}
                                    />
                                    <label htmlFor="ativo">Usuário ativo</label>
                                </div>
                            </div>
                            )}
                    </div>
                    <div>
                        <h2>Endereços Salvos</h2>
                        
                        {usuario.enderecos.length === 0 ? (
                        <p className="mt-3 text-gray-500">Nenhum endereço cadastrado.</p>
                        ) : (
                        usuario.enderecos.map((endereco, i) => (
                            <div key={endereco.id} className="mt-4">
                                <h3 className="text-yellow-primary font-medium">Endereço {i + 1}:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                    <label>Rua</label>
                                    <Input type="text" value={endereco.rua} readOnly />
                                    </div>
                                    <div>
                                    <label>Bairro</label>
                                    <Input type="text" value={endereco.bairro} readOnly />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                    <label>CEP</label>
                                    <Input type="text" value={endereco.cep} readOnly />
                                    </div>
                                    <div>
                                    <label>Número</label>
                                    <Input type="text" value={endereco.numero} readOnly />
                                    </div>
                                    <div>
                                    <label>Complemento</label>
                                    <Input type="text" value={endereco.complemento} readOnly />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                    <label>Cidade</label>
                                    <Input type="text" value={endereco.cidade} readOnly />
                                    </div>
                                    <div>
                                    <label>Estado</label>
                                    <Input type="text" value={endereco.estado} readOnly />
                                    </div>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                    <div>
                        <h2>Históricos de Assinaturas</h2>
                        {usuario.assinaturas.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                Nenhuma assinatura encontrada.
                            </div>
                            ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2">Assinatura</th>
                                    <th className="p-2">Plano</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Data de Início</th>
                                </tr>
                                </thead>
                                <tbody>
                                {usuario.assinaturas.map((assinatura) => (
                                    <tr key={assinatura.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{assinatura.id}</td>
                                        <td className="p-2">{assinatura.plano_id}</td>
                                        <td className="p-2">{assinatura.status}</td>
                                        <td className="p-2">
                                            {new Date(assinatura.data_inicio).toLocaleDateString("pt-BR")}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {isEditMode && (
                    <div className="flex items-center gap-6 justify-start mt-8">
                        <Link href="/admin/assinaturas">
                            <Button variant="tertiary" className="border-1">
                                Verificar Assinaturas
                            </Button>
                        </Link>
                     <Button type="submit" disabled={salvando} className="flex items-center justify-center">
                        {salvando ? (
                            <span className="mx-[53px] my-[3px] animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-4"></span>
                        ) : (
                            "Salvar Alterações"
                        )}
                    </Button>
                    </div>
                )}
                </form>
            </DataCard>
        </div>
    );
}
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
            console.log(error)
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
            console.log(error)
        } finally {
            setSalvando(false);
        }
    }

    function encurtarId(id: string, tamanho = 15) {
        if (!id) return "";
        return id.length > tamanho ? id.slice(0, tamanho) + "..." : id;
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
                        <h2 className="text-lg font-semibold text-brown-tertiary">Informações pessoais</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Nome do cliente</label>
                                <Input type="text" value={nomeCompleto}
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setNomeCompleto(e.target.value)}/>
                            </div>
                            <div>
                                <label htmlFor="">Email</label>
                                <Input type="email" value={email}
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">CPF</label>
                                <Input type="text" value={usuario.info.cpf} readOnly disabled/>
                            </div>
                            <div>
                                <label htmlFor="">Data de cadastro</label>
                                <Input type="text" value={new Date(usuario.info.data_criacao).toLocaleDateString("pt-BR")}
                                readOnly
                                disabled/>
                            </div>
                        </div>
                        {isEditMode && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-center">
                                <div>
                                <label>Função</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="cursor-pointer p-3 bg-transparent w-full text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35"
                                >
                                    <option value="cliente">Cliente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        id="ativo"
                                        type="checkbox"
                                        className="accent-brown-primary size-4 cursor-pointer"
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
                        <h2 className="text-lg font-semibold text-brown-tertiary">Endereços Salvos</h2>
                        
                        {usuario.enderecos.length === 0 ? (
                        <p className="mt-3 text-gray-500 text-center text-base">Nenhum endereço cadastrado.</p>
                        ) : (
                        usuario.enderecos.map((endereco, i) => (
                            <div key={endereco.id} className="mt-4">
                                <h3 className="text-yellow-primary font-medium">Endereço {i + 1}:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    <div>
                                    <label>Rua</label>
                                    <Input type="text" value={endereco.rua} readOnly disabled/>
                                    </div>
                                    <div>
                                    <label>Bairro</label>
                                    <Input type="text" value={endereco.bairro} readOnly disabled/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                    <label>CEP</label>
                                    <Input type="text" value={endereco.cep} readOnly disabled/>
                                    </div>
                                    <div>
                                    <label>Número</label>
                                    <Input type="text" value={endereco.numero} readOnly disabled/>
                                    </div>
                                    <div>
                                    <label>Complemento</label>
                                    <Input type="text" value={endereco.complemento} readOnly disabled/>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                    <label>Cidade</label>
                                    <Input type="text" value={endereco.cidade} readOnly disabled/>
                                    </div>
                                    <div>
                                    <label>Estado</label>
                                    <Input type="text" value={endereco.estado} readOnly disabled/>
                                    </div>
                                </div>
                            </div>
                            ))
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-brown-tertiary">Históricos de Assinaturas</h2>
                        {usuario.assinaturas.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 text-base">
                                Nenhuma assinatura cadastrada.
                            </div>
                            ) : (
                            <table className="w-5/6 mt-4 border-collapse">
                                <thead className="border border-brown-primary">
                                <tr className="uppercase text-left">
                                    <th className="border border-brown-primary p-2">Assinatura</th>
                                    <th className="border border-brown-primary p-2">Plano</th>
                                    <th className="border border-brown-primary p-2">Status</th>
                                    <th className="border border-brown-primary p-2">Data de Início</th>
                                </tr>
                                </thead>
                                <tbody className="mt-2 border border-brown-primary">
                                {usuario.assinaturas.map((assinatura) => (
                                    <tr key={assinatura.id}>
                                        <td className="p-2 border border-brown-primary">{encurtarId(assinatura.id)}</td>
                                        <td className="p-2 border border-brown-primary">{assinatura.plano_id.split('_').join(' ')}</td>
                                        <td className="p-2 border border-brown-primary">{assinatura.status}</td>
                                        <td className="p-2 border border-brown-primary">
                                            {new Date(assinatura.data_inicio).toLocaleDateString("pt-BR")}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {isEditMode && (
                    <div className="flex flex-col items-start gap-4 justify-start mt-8">
                        <h2 className="text-lg font-semibold text-brown-tertiary">Ações do Administrador</h2>
                        <div className="flex flex-col lg:flex-row items-center gap-6 justify-start mb-8">
                            <Link href="/admin/assinaturas">
                                <Button variant="tertiary" className="border-2 font-medium">
                                    Verificar Assinaturas
                                </Button>
                            </Link>
                            <Button type="submit" disabled={salvando} className="font-medium flex items-center justify-center px-12">
                                {salvando ? (
                                    <span className="mx-[53px] my-[3px] animate-spin rounded-full border-4 border-beige-primary border-t-transparent size-4"></span>
                                ) : (
                                    "Salvar Alterações"
                                )}
                            </Button>
                        </div>
                    </div>
                )}
                </form>
            </DataCard>
        </div>
    );
}
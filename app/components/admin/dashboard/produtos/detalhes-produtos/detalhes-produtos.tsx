"use client";
import Modal from "@/app/components/dashboard/modal";
import Button from "@/app/components/ui/button";
import DataCard from "@/app/components/ui/data-card";
import Input from "@/app/components/ui/input";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { deleteBox, getBoxDetalhes, updateBox } from "@/app/services/admin";
import { X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Box = {
  id: string;
  nome: string;
  descricao_curta: string;
  descricao_longa: string;
  especificacao: string;

  imagem_principal_url: string;
  imagem_url_2?: string;
  imagem_url_3?: string;
  imagem_url_4?: string;
  imagem_url_5?: string;

  preco_mensal_4_un: string;
  preco_mensal_6_un: string;
  preco_anual_4_un: string;
  preco_anual_6_un: string;

  ativo: boolean;

  data_criacao: string;
  data_atualizacao: string | null;

  id_antigo?: string;
};

export default function DetalhesProdutos({ modo }: { modo: "ver" | "editar" }) {

    const isEditMode = modo === "editar";
    const router = useRouter();
    const { token } = useAdminAuth();
    const params = useParams();
    const id_box = params.id_box as string; 
    const id = params.id as string; 

    const [box, setBox] = useState<Box | null>(null);
    const [loading, setLoading] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const [nome, setNome] = useState("");
    const [descricaoCurta, setDescricaoCurta] = useState("");
    const [descricaoLonga, setDescricaoLonga] = useState("");
    const [especificacao, setEspecificacao] = useState("");
    const [precoMensal4un, setPrecoMensal4un] = useState("");
    const [precoMensal6un, setPrecoMensal6un] = useState("");
    const [precoAnual4un, setPrecoAnual4un] = useState("");
    const [precoAnual6un, setPrecoAnual6un] = useState("");
    const [ativo, setAtivo] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [boxToDelete, setBoxToDelete] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const openModal = (id: string) => {
        setBoxToDelete(id);
        setModalOpen(true);
    };

    const closeModal = () => {
    setModalOpen(false);
    };


    useEffect(() => {
    if (!token) return;
    
        const fetchBox = async () =>  {
            try {
                setLoading(true);
                const data = await getBoxDetalhes(token, id_box);
                setBox(data.data);

                setNome(data.data.nome || "");
                setDescricaoCurta(data.data.descricao_curta || "");
                setDescricaoLonga(data.data.descricao_longa || "");
                setEspecificacao(data.data.especificacao || "");
                setPrecoMensal4un(data.data.preco_mensal_4_un || "");
                setPrecoMensal6un(data.data.preco_mensal_6_un || "");
                setPrecoAnual4un(data.data.preco_anual_4_un || "");
                setPrecoAnual6un(data.data.preco_anual_6_un || "");
                setAtivo(data.data.ativo ?? false);
            } catch (error) {
                toast.error("Erro ao carregar detalhes da Box.");
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchBox();

    }, [id_box, token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!token || !box) return;

        try {
            setSalvando(true);
            await updateBox(token, box.id, 
                {      
                    nome,
                    descricao_curta: descricaoCurta,
                    descricao_longa: descricaoLonga,
                    especificacao,

                    preco_mensal_4_un: Number(precoMensal4un),
                    preco_mensal_6_un: Number(precoMensal6un),
                    preco_anual_4_un: Number(precoAnual4un),
                    preco_anual_6_un: Number(precoAnual6un),

                    ativo
            });
            toast.success("Box atualizada com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar box.");
            console.log(error)
        } finally {
            setSalvando(false);
        }
    }

    const handleDeleteBox = async () => {
        if (!token || !boxToDelete) return;

        try {
            setDeleteLoading(true);
            const res = await deleteBox(token, boxToDelete);

            toast.success("Box excluída com sucesso!");
            setBox(null);
            router.push(`/admin/${id}/dashboard/produtos`);
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Erro ao excluir box.");
        } finally {
            closeModal();
            setBoxToDelete(null);
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Carregando Box...</p>;
    }

    if (!box) {
        return <p className="text-center mt-10 text-red-500">Box não encontrada.</p>;
    }


    return(
        <div className="w-full h-full pt-8 md:pr-10">
            <DataCard className="p-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Nome da Box</label>
                                <Input type="text" value={nome || ""}
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setNome(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Descrição curta</label>
                                <textarea value={descricaoCurta || ""} 
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setDescricaoCurta(e.target.value)}
                                className="w-full text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35 text-xs sm:text-sm w-full p-3 bg-transparent"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Descrição Longa</label>
                                <textarea rows={8} value={descricaoLonga || ""} 
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setDescricaoLonga(e.target.value)}
                                className="w-full text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35 text-xs sm:text-sm w-full p-3 bg-transparent"/>
                            </div>
                            <div>
                                <label htmlFor="">Especificação:</label>
                                <textarea rows={8} value={especificacao || ""} 
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setEspecificacao(e.target.value)}
                                className="w-full text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35 text-xs sm:text-sm w-full p-3 bg-transparent"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Preço Mensal (4und):</label>
                                <Input type="text" value={precoMensal4un || ""}
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setPrecoMensal4un(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Preço Anual (4und):</label>
                                <Input type="text" value={precoAnual4un || ""}
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setPrecoAnual4un(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Preço Mensal (6und):</label>
                                <Input type="text" value={precoMensal6un || ""}
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setPrecoMensal6un(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Preço Anual (6und):</label>
                                <Input type="text" value={precoAnual6un || ""}
                                readOnly={!isEditMode}
                                disabled={!isEditMode}
                                onChange={(e) => setPrecoAnual6un(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex mt-4 items-center">
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    id="ativo"
                                    type="checkbox"
                                    className="accent-brown-primary size-5 cursor-pointer"
                                    checked={ativo}
                                    disabled={!isEditMode}
                                    onChange={(e) => setAtivo(e.target.checked)}
                                />
                                <label htmlFor="ativo">Deixar essa box ativa</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-brown-tertiary">Imagens: </h2>
                        {
                            isEditMode && (
                                <div className="flex items-center gap-8 py-5">
                                    <div className="text-brown-primary text-sm font-secondary font-medium text-start">
                                        <p>Tamanho do arquivo: no máximo 1 MB</p>
                                        <p>Extensão de arquivo: JPEG, PNG</p>
                                    </div>
                                    <Button
                                        variant="senary"
                                        className={`px-6 py-3 font-medium text-xs rounded-md uppercase`}
                                        type="button"
                                    >
                                        Selecionar a Imagem
                                    </Button>               
                                    <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    hidden
                                    />
                                </div>
                            )
                        }
                        <div>
                            { !box?.imagem_principal_url && !box?.imagem_url_2 && !box?.imagem_url_3 && !box?.imagem_url_4 && !box?.imagem_url_5 ? (
                                    <p className="text-gray-500 text-start">Nenhuma imagem encontrada!</p>
                                ) : (
                                    <div className="py-4 flex flex-wrap items-center gap-4">
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            { isEditMode && (
                                                <button className="absolute top-3 right-3 z-10">
                                                    <X size={18} className="text-white"  strokeWidth={3}/>
                                                </button>
                                                )
                                            }
                                            <img
                                                src={box?.imagem_principal_url}
                                                alt=""
                                                className="size-24 object-cover rounded-xl"
                                            />
                                        </DataCard>
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            { isEditMode && (
                                                <button className="absolute top-3 right-3 z-10">
                                                    <X size={18} className="text-white"  strokeWidth={3}/>
                                                </button>
                                                )
                                            }
                                            <img
                                                src={box?.imagem_url_2}
                                                alt=""
                                                className="size-24 object-cover rounded-xl"
                                            />
                                        </DataCard>
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            { isEditMode && (
                                                <button className="absolute top-3 right-3 z-10">
                                                    <X size={18} className="text-white"  strokeWidth={3}/>
                                                </button>
                                                )
                                            }
                                            <img src={box?.imagem_url_3} alt="" className="size-24 object-cover rounded-xl"/>
                                        </DataCard>
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            { isEditMode && (
                                                <button className="absolute top-3 right-3 z-10">
                                                    <X size={18} className="text-white"  strokeWidth={3}/>
                                                </button>
                                                )
                                            }
                                            <img src={box?.imagem_url_4} alt="" className="size-24 object-cover rounded-xl"/>
                                        </DataCard>
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            { isEditMode && (
                                                <button className="absolute top-3 right-3 z-10">
                                                    <X size={18} className="text-white"  strokeWidth={3}/>
                                                </button>
                                                )
                                            }
                                            <img src={box?.imagem_url_5} alt="" className="size-24 object-cover rounded-xl"/>
                                        </DataCard>
                                    </div>
                                )
                            } 
                        </div>
                    </div>
                    {isEditMode && (
                    <div className="flex flex-col items-start gap-4 justify-start mt-8">
                        <h2 className="text-lg font-semibold text-brown-tertiary">Ações do Administrador</h2>
                        <div className="flex flex-col lg:flex-row items-center gap-6 justify-start mb-8">
                            <Button className="font-medium px-12 bg-red-600 text-beige-primary hover:bg-red-600/80" onClick={() => openModal(box.id)}>
                                Excluir essa Box
                            </Button>
                            <Button type="submit" className="font-medium flex items-center justify-center px-12">
                                Salvar Alterações
                            </Button>
                        </div>
                    </div>
                    )}
                </form>
            </DataCard>
            <Modal title="Deseja excluir essa Box?" description="Ao confirmar, os dados dessa box serão excluídos." isLoading={deleteLoading} isOpen={modalOpen} onClose={closeModal} onConfirm={handleDeleteBox} />
        </div>
    );
}
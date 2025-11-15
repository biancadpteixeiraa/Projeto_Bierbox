"use client";
import Button from "@/app/components/ui/button";
import DataCard from "@/app/components/ui/data-card";
import Input from "@/app/components/ui/input";
import { useAdminAuth } from "@/app/context/authAdminContext";
import { addBox} from "@/app/services/admin";
import { X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type ImagensSelecionadas = {
  imagem_principal_url: File | null;
  imagem_url_2: File | null;
  imagem_url_3: File | null;
  imagem_url_4: File | null;
  imagem_url_5: File | null;
};

export default function NewProduto() {

    const { token } = useAdminAuth();

    const [loading, setLoading] = useState(false);

    const [nome, setNome] = useState("");
    const [descricaoCurta, setDescricaoCurta] = useState("");
    const [descricaoLonga, setDescricaoLonga] = useState("");
    const [especificacao, setEspecificacao] = useState("");
    const [precoMensal4un, setPrecoMensal4un] = useState("");
    const [precoMensal6un, setPrecoMensal6un] = useState("");
    const [precoAnual4un, setPrecoAnual4un] = useState("");
    const [precoAnual6un, setPrecoAnual6un] = useState("");
    const [ativo, setAtivo] = useState(false);
    const [imagens, setImagens] = useState<ImagensSelecionadas>({
        imagem_principal_url: null,
        imagem_url_2: null,
        imagem_url_3: null,
        imagem_url_4: null,
        imagem_url_5: null,
    });
    const [previews, setPreviews] = useState({
        imagem_principal_url: "",
        imagem_url_2: "",
        imagem_url_3: "",
        imagem_url_4: "",
        imagem_url_5: "",
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function abrirSelecionarImagens() {
        fileInputRef.current?.click();
    }

    function handleSelectImages(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const novosPreviews: any = { ...previews };
        const novasImagens: any = { ...imagens };

        const arquivos = Array.from(files).slice(0, 5);

        for (let file of arquivos) {
            if (file.size > 1024 * 1024) {
                toast.error(`A imagem ${file.name} excede 1MB.`);
                continue;
            }
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                toast.error(`Formato inválido no arquivo ${file.name}. Use PNG ou JPEG.`);
                continue;
            }
        }

        arquivos.forEach((file, index) => {
            const campo = [
                "imagem_principal_url",
                "imagem_url_2",
                "imagem_url_3",
                "imagem_url_4",
                "imagem_url_5"
            ][index];

            novasImagens[campo] = file;
            novosPreviews[campo] = URL.createObjectURL(file);
        });

        setImagens(novasImagens);
        setPreviews(novosPreviews);

        if (fileInputRef.current) fileInputRef.current.value = "";
    }


    function removerImagem(campo: keyof ImagensSelecionadas) {
        setImagens(prev => ({ ...prev, [campo]: null }));
        setPreviews(prev => ({ ...prev, [campo]: "" }));
    }

    // async function handleSubmit(e: React.FormEvent) {
    //     e.preventDefault();
    //     if (!token) return;

    //     const formData = new FormData();

    //     formData.append("nome", nome);
    //     formData.append("descricao_curta", descricaoCurta);
    //     formData.append("descricao_longa", descricaoLonga);
    //     formData.append("especificacao", especificacao);

    //     formData.append("preco_mensal_4_un", precoMensal4un);
    //     formData.append("preco_mensal_6_un", precoMensal6un);
    //     formData.append("preco_anual_4_un", precoAnual4un);
    //     formData.append("preco_anual_6_un", precoAnual6un);

    //     formData.append("ativo", String(ativo));

    //     Object.entries(imagens).forEach(([key, file]) => {
    //     if (file) formData.append(key, file);
    //     });

    //     try {
    //         setLoading(true);
    //         await addBox(token,formData);
    //         toast.success("Box criada com sucesso!");
    //     } catch (error) {
    //         toast.error("Erro ao criar box.");
    //         console.log(error)
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    const payload = {
        nome,
        descricao_curta: descricaoCurta,
        descricao_longa: descricaoLonga,
        especificacao,
        preco_mensal_4_un: Number(precoMensal4un),
        preco_mensal_6_un: Number(precoMensal6un),
        preco_anual_4_un: Number(precoAnual4un),
        preco_anual_6_un: Number(precoAnual6un),
        ativo
    };

    try {
        setLoading(true);
        await addBox(token, payload);
        toast.success("Box criada com sucesso!");
    } catch (error) {
        toast.error("Erro ao criar box.");
        console.log(error)
    } finally {
        setLoading(false);
    }
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
                                onChange={(e) => setNome(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Descrição curta</label>
                                <textarea value={descricaoCurta || ""} 
                                onChange={(e) => setDescricaoCurta(e.target.value)}
                                className="w-full text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35 text-xs sm:text-sm w-full p-3 bg-transparent"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Descrição Longa</label>
                                <textarea rows={8} value={descricaoLonga || ""} 
                                onChange={(e) => setDescricaoLonga(e.target.value)}
                                className="w-full text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35 text-xs sm:text-sm w-full p-3 bg-transparent"/>
                            </div>
                            <div>
                                <label htmlFor="">Especificação:</label>
                                <textarea rows={8} value={especificacao || ""} 
                                onChange={(e) => setEspecificacao(e.target.value)}
                                className="w-full text-gray-tertiary/75 placeholder:text-gray-tertiary/75 rounded-xl border border-gray-tertiary/35 text-xs sm:text-sm w-full p-3 bg-transparent"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Preço Mensal (4und):</label>
                                <Input type="text" value={precoMensal4un || ""}
                                onChange={(e) => setPrecoMensal4un(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Preço Anual (4und):</label>
                                <Input type="text" value={precoAnual4un || ""}
                                onChange={(e) => setPrecoAnual4un(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label htmlFor="">Preço Mensal (6und):</label>
                                <Input type="text" value={precoMensal6un || ""}
                                onChange={(e) => setPrecoMensal6un(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Preço Anual (6und):</label>
                                <Input type="text" value={precoAnual6un || ""}
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
                                    onChange={(e) => setAtivo(e.target.checked)}
                                />
                                <label htmlFor="ativo">Deixar essa box ativa</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-brown-tertiary">Imagens: </h2>
                        <div className="flex items-center gap-8 py-5">
                            <div className="text-brown-primary text-sm font-secondary font-medium text-start">
                                <p>Tamanho do arquivo: no máximo 1 MB</p>
                                <p>Extensão de arquivo: JPEG, PNG</p>
                            </div>
                            <Button
                                variant="senary"
                                className={`px-6 py-3 font-medium text-xs rounded-md uppercase`}
                                type="button"
                                onClick={abrirSelecionarImagens}
                            >
                                Selecionar Imagens
                            </Button>               
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                                multiple
                                hidden
                                onChange={handleSelectImages}
                            />
                        </div>
                        <div className="">
                            { !previews.imagem_principal_url && !previews.imagem_url_2 && !previews.imagem_url_3 && !previews.imagem_url_4 && !previews.imagem_url_5 ? (
                                <div/>
                                ) : (
                                <div className="py-4 flex flex-wrap items-center gap-4">
                                    {previews.imagem_principal_url && (
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            <button className="absolute top-3 right-3 z-10" onClick={() => removerImagem("imagem_principal_url")}>
                                                <X size={18} className="text-white" strokeWidth={3} />
                                            </button>
                                            <img src={previews.imagem_principal_url} className="size-24 object-cover rounded-xl" />
                                        </DataCard>
                                    )}

                                    {previews.imagem_url_2 && (
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            <button className="absolute top-3 right-3 z-10" onClick={() => removerImagem("imagem_url_2")}>
                                                <X size={18} className="text-white" strokeWidth={3} />
                                            </button>
                                            <img src={previews.imagem_url_2} className="size-24 object-cover rounded-xl" />
                                        </DataCard>
                                    )}

                                    {previews.imagem_url_3 && (
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            <button className="absolute top-3 right-3 z-10" onClick={() => removerImagem("imagem_url_3")}>
                                                <X size={18} className="text-white" strokeWidth={3} />
                                            </button>
                                            <img src={previews.imagem_url_3} className="size-24 object-cover rounded-xl" />
                                        </DataCard>
                                    )}

                                    {previews.imagem_url_4 && (
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            <button className="absolute top-3 right-3 z-10" onClick={() => removerImagem("imagem_url_4")}>
                                                <X size={18} className="text-white" strokeWidth={3} />
                                            </button>
                                            <img src={previews.imagem_url_4} className="size-24 object-cover rounded-xl" />
                                        </DataCard>
                                    )}

                                    {previews.imagem_url_5 && (
                                        <DataCard className="p-2 min-w-none relative flex items-center justify-center">
                                            <button className="absolute top-3 right-3 z-10" onClick={() => removerImagem("imagem_url_5")}>
                                                <X size={18} className="text-white" strokeWidth={3} />
                                            </button>
                                            <img src={previews.imagem_url_5} className="size-24 object-cover rounded-xl" />
                                        </DataCard>
                                    )}
                                </div>
                                )
                            } 
                        </div>
                    </div>
                    <div className="flex items-end gap-4 justify-end mt-8">
                        <div className="flex flex-col lg:flex-row items-center gap-6 justify-start mb-8">
                            <Button type="submit" className="font-medium flex items-center justify-center px-16">
                                {loading ? (
                                    "Carregando..."
                                ) : (
                                    "Criar Nova Box"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </DataCard>
        </div>
    );
}
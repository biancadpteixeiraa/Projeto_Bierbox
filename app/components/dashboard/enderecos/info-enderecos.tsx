"use client";
import { useCallback, useEffect, useState } from "react";
import Button from "../../ui/button";
import {
  getEnderecos,
  addEndereco,
  updateEndereco,
  deleteEndereco,
} from "@/app/services/enderecos";
import { useAuth } from "@/app/context/authContext";
import EnderecoForm from "../../forms/form-enderecos";
import { toast } from "react-toastify";
import Modal from "../modal";
import { EnderecoListSkeleton } from "../../ui/skeletons";

type Endereco = {
  id: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
  cep: string;
  complemento: string;
  is_padrao: boolean;
};

const DEFAULT_ENDERECO: Endereco = {
 id: "novo",
 rua: "",
 bairro: "",
 cidade: "",
 estado: "",
 numero: "",
 cep: "",
 complemento: "",
 is_padrao: false,
};

export default function InfoEnderecos() {
  const { token } = useAuth();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState<Endereco>(DEFAULT_ENDERECO);
  const [loading, setLoading] = useState(true);
  const [loadingEndereco, setLoadingEndereco] = useState(false)
  const [enderecoEmEdicao, setEnderecoEmEdicao] = useState<Endereco | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [enderecoParaExcluirId, setEnderecoParaExcluirId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setEnderecoParaExcluirId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEnderecoParaExcluirId(null);
  };

  const handleConfirmarExclusao = async () => {
    if(enderecoParaExcluirId){
        await handleExcluir(enderecoParaExcluirId);
        closeModal();
    }
  };

  useEffect(() => {
    const fetchEnderecos = async () => {
      if (!token) return; 
      try {
        const data = await getEnderecos(token);
        setEnderecos(data);
      } catch (err) {
        console.error("Erro ao buscar endereços:", err);
        toast.error("Erro ao carregar endereços. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnderecos();
  }, [token]);

  const toggleEditar = (endereco: Endereco) => {
    if (editandoId === endereco.id) {
      setEditandoId(null);
      setEnderecoEmEdicao(null);
    } else {
      setEditandoId(endereco.id);
      setEnderecoEmEdicao({ ...endereco });
      setIsCreating(false); 
    }
  };

 const handleEnderecoEmEdicaoChange = useCallback(
  (campo: keyof Endereco, valor: string | boolean) => {
   setEnderecoEmEdicao((prev) => {
    if (prev) {
     return { ...prev, [campo]: valor } as Endereco;
    }
    return null;
   });
  },
  []
 );

 const handleNovoEnderecoChange = useCallback(
  (campo: keyof Endereco, valor: string | boolean) => {
   setNovoEndereco((prev) => ({ ...prev, [campo]: valor } as Endereco)); // Cast seguro
  },
  []
 );

  const handleSalvarNovo = useCallback(async () => {
    if (!token) return;

    const e = novoEndereco; 
    const newErrors: { [key: string]: string } = {};

    if (!e.rua.trim()) newErrors.rua = "Rua é obrigatória.";
    if (!e.cep.trim()) newErrors.cep = "CEP é obrigatório.";
    if (!e.numero.trim()) newErrors.numero = "Número é obrigatório.";
    if (!e.bairro.trim()) newErrors.bairro = "Bairro é obrigatório.";
    if (!e.complemento.trim()) newErrors.complemento = "Complemento é obrigatório.";
    if (!e.cidade.trim()) newErrors.cidade = "Cidade é obrigatória.";
    if (!e.estado.trim()) newErrors.estado = "Estado é obrigatório.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const primeiraMensagem = Object.values(newErrors)[0];
      toast.error(primeiraMensagem);
      return;
    }

    try {
      setLoadingEndereco(true);
      const novo = await addEndereco(
      token,
      e.cep,
      e.rua,
      e.numero,
      e.bairro,
      e.complemento,
      e.cidade,
      e.estado,
      e.is_padrao
      );
      setEnderecos((prev) => [...prev, novo]);
      setNovoEndereco(DEFAULT_ENDERECO); 
      setIsCreating(false);
      toast.success("Endereço adicionado com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar endereço:", err);
      toast.error("Erro ao salvar endereço. Tente novamente.")
    } finally {
      setLoadingEndereco(false)
    }
  }, [token, novoEndereco]);

  const handleSalvarEdicao = useCallback(async () => {
  if (!token || !enderecoEmEdicao) return;

  const e = enderecoEmEdicao;

  try {
    setLoadingEndereco(true);
    const atualizado = await updateEndereco(
      token,
      e.id,
      e.cep,
      e.rua,
      e.numero,
      e.bairro,
      e.complemento,
      e.cidade,
      e.estado,
      e.is_padrao
    );

    setEnderecos((prev) =>
      prev.map((end) => (end.id === e.id ? atualizado : end))
    );
    setEditandoId(null);
    setEnderecoEmEdicao(null);
    toast.success("Endereço atualizado com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    toast.error("Erro ao atualizar endereço. Tente novamente.")
  } finally {
    setLoadingEndereco(false);
  }
  }, [token, enderecoEmEdicao, setEnderecos, setEditandoId, setEnderecoEmEdicao]);

  const handleExcluir = useCallback(async (id: string | number) => {
    if (!token) return;

    try {
      await deleteEndereco(token, id.toString());
      setEnderecos((prev) => prev.filter((e) => e.id !== id));
      if (editandoId === id) {
        setEditandoId(null);
        setEnderecoEmEdicao(null);
      }
      toast.success("Endereço excluído com sucesso!");
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao excluir endereço. Tente novamente.";

    toast.error(backendMessage);
    }
  }, [token, editandoId]);


  if (loading) return <EnderecoListSkeleton />;

  return (
    <div className="pl-8 lg:pl-12 pr-8 lg:pr-36 h-full flex flex-col max-w-screen-2xl">
      {enderecos.length === 0 && !isCreating ? (
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto pt-20">
          <h1 className="text-brown-tertiary md:text-2xl text-xl font-secondary font-bold pb-10">
            Você ainda não tem endereços cadastrados!
          </h1>
          <img
            src="/NoAddress.png"
            alt="Sem endereços"
            className="md:w-[550px] w-auto mx-auto md:mb-6 pb-20"
          />
          <Button
            onClick={() => {
              setIsCreating(true);
              setEditandoId(null);
              setNovoEndereco(DEFAULT_ENDERECO);
            }}
            className="w-full mb-20 md:text-lg text-sm"
            variant="quaternary"
          >
            Cadastrar meu primeiro endereço
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between max-w-4xl">
            <h1 className="text-brown-tertiary md:text-xl text-base font-secondary font-bold">
              Meus Endereços:
            </h1>
            {!isCreating && (
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditandoId(null);
                  setNovoEndereco(DEFAULT_ENDERECO);
                }}
                className="md:text-base text-xs text-blue-primary font-bold underline hover:text-blue-hover transition text-end"
              >
                + Novo Endereço
              </button>
            )}
          </div>

          <div className="flex flex-col pt-8 h-full pb-8 gap-8 items-end max-w-4xl">
            {isCreating && (
                <EnderecoForm
                  endereco={novoEndereco}
                  isEditando
                  titulo="Novo Endereço"
                  onChange={handleNovoEnderecoChange}
                  onSalvar={handleSalvarNovo}
                  onCancelar={() => setIsCreating(false)}
                  errors={errors} 
                  isLoading={loadingEndereco}
                />
            )}
            {enderecos.map((endereco, index) => {

              const isEditando = editandoId === endereco.id;
              const currentData = isEditando ? enderecoEmEdicao : endereco;

              const enderecoNumero = index + 1;

              if (!currentData) return null;

              return (
                    <EnderecoForm
                    key={currentData.id}
                    endereco={currentData}
                    isEditando={isEditando}
                    titulo={`Endereço ${enderecoNumero}`}
                    onChange={handleEnderecoEmEdicaoChange}
                    onSalvar={handleSalvarEdicao}
                    onCancelar={() => toggleEditar(endereco)}
                    onEditar={() => toggleEditar(endereco)}
                    onExcluir={() => openModal(endereco.id)}
                    isLoading={loadingEndereco}
                  />
              );
            })}
          </div>
        </>
      )}
      <Modal title="Deseja excluir esse Endereço?" description="Ao confirmar, esses dados de endereço serão excluídos." isOpen={modalOpen} onClose={closeModal} onConfirm={handleConfirmarExclusao} />
    </div>
  );
}
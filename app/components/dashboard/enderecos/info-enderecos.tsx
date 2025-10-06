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
 id: "novo", // ID temporário para o formulário
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
  const [enderecoEmEdicao, setEnderecoEmEdicao] = useState<Endereco | null>(null);

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

  // 1. Função para iniciar ou cancelar a edição
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

  // 2. Função para rastrear mudanças no endereço em edição
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

  // 3. Função para mudar o campo de novo endereço
 const handleNovoEnderecoChange = useCallback(
  (campo: keyof Endereco, valor: string | boolean) => {
   setNovoEndereco((prev) => ({ ...prev, [campo]: valor } as Endereco)); // Cast seguro
  },
  []
 );

// 4. Salvar novo endereço (Simplificada)
const handleSalvarNovo = useCallback(async () => {
  if (!token) return;

  const e = novoEndereco; 

  if (!e.rua || !e.cep ) {
    alert("Preencha pelo menos a Rua e o CEP");
    return;
  }

  try {
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
  }
}, [token, novoEndereco]);

// 5. Salvar edição (Simplificada)
const handleSalvarEdicao = useCallback(async () => {
 if (!token || !enderecoEmEdicao) return;

 const e = enderecoEmEdicao;

 try {
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
 }
}, [token, enderecoEmEdicao, setEnderecos, setEditandoId, setEnderecoEmEdicao]);

 // 6. Excluir
 const handleExcluir = useCallback(async (id: string | number) => {
  if (!token) return;

  if (!window.confirm("Tem certeza que deseja excluir este endereço?")) return;

  try {
   await deleteEndereco(token, id.toString());
   setEnderecos((prev) => prev.filter((e) => e.id !== id));
   if (editandoId === id) {
    setEditandoId(null);
    setEnderecoEmEdicao(null);
  }
    toast.success("Endereço excluído com sucesso!");
  } catch (err) {
    console.error("Erro ao excluir:", err);
    toast.error("Erro ao excluir endereço. Tente novamente.")
  }
 }, [token, editandoId]);



  if (loading) return <p className="p-14">Carregando...</p>;

  return (
    <div className="pl-8 lg:pl-12 pr-8 lg:pr-36 h-full flex flex-col max-w-screen-2xl">
      {enderecos.length === 0 && !isCreating ? (
        // Caso sem endereços
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
              setEditandoId(null); // Fecha qualquer edição ao abrir o formulário de criação
              setNovoEndereco(DEFAULT_ENDERECO); // Limpa o formulário de novo endereço
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
                  setEditandoId(null); // Fecha qualquer edição ao abrir o formulário de criação
                  setNovoEndereco(DEFAULT_ENDERECO);
                }}
                className="md:text-base text-xs text-blue-primary font-bold underline hover:text-blue-hover transition text-end"
              >
                + Novo Endereço
              </button>
            )}
          </div>

          <div className="flex flex-col pt-8 h-full pb-8 gap-8 items-end max-w-4xl">
            {/* Formulário de criação */}
            {isCreating && (
                <EnderecoForm
                  endereco={novoEndereco}
                  isEditando
                  titulo="Novo Endereço"
                  onChange={handleNovoEnderecoChange}
                  onSalvar={handleSalvarNovo}
                  onCancelar={() => setIsCreating(false)}
                />
            )}

            {/* Lista de endereços existentes */}
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
                    onEditar={() => toggleEditar(endereco)}   // <- habilita edição
                    onExcluir={() => handleExcluir(endereco.id)} // <- habilita exclusão
                  />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
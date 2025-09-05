"use client";
import { useRef, useState, useEffect } from "react";
import UserForm from "../forms/form-user";
import Button from "../ui/button";
import { useAuth } from "@/app/context/authContext";
import { updateUserPhoto, getUserInfo, deleteUserAccount } from "@/app/services/user";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function InfoPessoais() {
  const { token, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        toast.loading("Carregando perfil...");
        const response = await getUserInfo(token);
        if (response.success) {
          setUserData(response.user);
        } else {
          toast.error("Não foi possível carregar seus dados.");
          if (response.message?.toLowerCase().includes("token")) logout();
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro inesperado ao carregar perfil.");
      } finally {
        setLoading(false);
        toast.dismiss();
      }
    };

    fetchData();
  }, [token, logout]);

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.info("Apenas imagens JPEG e PNG são permitidas.");
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.info("O arquivo deve ter no máximo 1MB.");
      return;
    }

    if (!token) return;

    try {
      const response = await updateUserPhoto(token, file);
      if (response.success) {
        toast.success("Foto atualizada com sucesso!");
        const updated = await getUserInfo(token);
        if (updated.success) setUserData(updated.user);
      } else {
        toast.error("Não foi possível atualizar a foto.");
        console.error("Erro: ", response.message);
      }
    } catch (err) {
      console.error("Erro: ", err);
      toast.error("Erro inesperado ao enviar foto.");
    } finally {
      toast.dismiss();
    }
  };

  const handleDeleteUser = async () => {
    if (!token) return;

    try{
      const response = await deleteUserAccount(token);
      if(response.success){
        toast.success("Usuário excluído!");
        logout();
        router.push('/');
      } else {
        toast.error("Não foi possível excluir usuário");
        console.error("Erro: ", response.message);
      }
    } catch (err){
      console.error("Erro: ", err);
      toast.error("Erro inesperado ao excluir usuário!");
    } finally {
      toast.dismiss();
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="pl-16 py-10">
      <h1 className="text-brown-tertiary text-2xl font-secondary font-bold">
        Informações Pessoais:
      </h1>
      <div className="flex pt-10">
        <div className="border-t border-r border-gray-primary w-9/12 pr-40 py-8">
          <UserForm />
        </div>
        <div className="flex flex-col items-center justify-between w-5/12 pb-20">
          <div className="flex flex-col items-center">
            <img
              alt="Foto do usuário"
              src={userData?.foto_perfil_url || "/user.png"}
              className="size-38 object-cover rounded-full border"
            />
            <Button
              variant="senary"
              className="mt-6 px-6 py-3 font-medium text-base rounded-none uppercase"
              onClick={handleSelectImage}
              type="button"
            >
              Selecionar a Imagem
            </Button>
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
            <div className="pt-10 text-brown-primary text-base font-secondary font-medium">
              <p>Tamanho do arquivo: no máximo 1 MB</p>
              <p>Extensão de arquivo: JPEG, PNG</p>
            </div>
          </div>
          <div className="flex items-center text-center pt-10 text-black text-base font-secondary font-medium">
            <p>
              Deseja excluir sua conta?{" "}
              <span className="underline cursor-pointer" onClick={handleDeleteUser}>Clique aqui</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

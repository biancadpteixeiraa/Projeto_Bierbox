// info-pessoais:
"use client";

import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Modal from "../modal";
import UserForm from "../../forms/form-user";
import { useAuth } from "@/app/context/authContext";
import {
  updateUserPhoto,
  getUserInfo,
  deleteUserAccount,
} from "@/app/services/user";
import UserAvatar from "./user-avatar";
import DeleteUser from "./delete-user";
import { UserInfoSkeleton } from "../../ui/skeletons";

interface User {
  foto_perfil_url?: string;
  [key: string]: any;
}

export default function InfoPessoais() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

   const openModal = () => {
   setModalOpen(true);
  };

  const closeModal = () => {
   setModalOpen(false);
  };

  useEffect(() => {
   if (!token) return;

   const fetchUserData = async () => {
    try {
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

   fetchUserData();
  }, [token, logout]);

  const handleSelectImage = () => fileInputRef.current?.click();

  const validateImage = (file: File) => {
   if (!["image/jpeg", "image/png"].includes(file.type)) {
    toast.info("Apenas imagens JPEG e PNG são permitidas.");
    return false;
   }
   if (file.size > 1024 * 1024) {
    toast.info("O arquivo deve ter no máximo 1MB.");
    return false;
   }
   return true;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
  if (!token || !e.target.files?.length) return;

  const file = e.target.files[0];
  if (!validateImage(file)) return;

  // 🔥 Ativa o loading antes de começar upload
  setImgLoading(true);
  setImgError(false);

  try {
    const response = await updateUserPhoto(token, file);
    if (response.success) {
      toast.success("Foto atualizada com sucesso!");
      
      // ⚡ Usa a URL que o backend já devolve
      if (response.user?.foto_perfil_url) {
        setUserData(prev => ({
          ...prev!,
          foto_perfil_url: response.user.foto_perfil_url,
        }));
      } else {
        // fallback pra buscar novamente se necessário
        const updated = await getUserInfo(token);
        if (updated.success) setUserData(updated.user);
      }
    } else {
      toast.error("Não foi possível atualizar a foto.");
      console.error("Erro: ", response.message);
      setImgLoading(false);
    }
  } catch (err) {
    console.error("Erro: ", err);
    toast.error("Erro inesperado ao enviar foto.");
    setImgLoading(false);
  }
};

  const handleDeleteUser = async () => {
   if (!token) return;

   try {
    const response = await deleteUserAccount(token);
    if (response.success) {
     toast.success("Usuário excluído!");
     logout();
     router.push("/");
    } else {
     toast.error("Não foi possível excluir usuário");
     console.error("Erro: ", response.message);
    }
   } catch (err) {
    console.error("Erro: ", err);
    toast.error("Erro inesperado ao excluir usuário!");
   } finally {
    toast.dismiss();
   }
  };

  if (loading) return <UserInfoSkeleton />;

  return (
   <div className="pl-8 lg:pl-12 h-full flex flex-col max-w-screen-2xl">
    <div className="w-full block lg:hidden size-36 flex justify-center mb-10 pr-8">
     <UserAvatar
       src={userData?.foto_perfil_url}
       imgLoading={imgLoading}
       imgError={imgError}
       setImgError={setImgError}
       setImgLoading={setImgLoading}
       onSelectImage={handleSelectImage}
       fileInputRef={fileInputRef}
       onFileChange={handleFileChange}
       isMobile
     />
    </div>

    <h1 className="text-brown-tertiary text-xl font-secondary font-bold">
     Informações Pessoais:
    </h1>

    <div className="flex flex-col lg:flex-row pt-8 h-full pb-8">
     <div className="lg:border-t border-gray-primary lg:w-8/12 xl:pr-32 pr-8 pt-6 pb-12">
       <UserForm />
     </div>

     {/* Texto de exclusão Mobile */}
     <DeleteUser
       className="block lg:hidden"
       onDelete={handleDeleteUser}
     />

     <div className="hidden lg:block h-[550px] w-1 border-gray-primary border-l" />

     {/* Avatar Desktop */}
     <div className="hidden lg:flex flex-col items-center justify-between w-5/12 pb-20 xl:pb-40 px-2">
       <div className="flex flex-col items-center justify-center pb-10">
        <UserAvatar
         src={userData?.foto_perfil_url}
         imgLoading={imgLoading}
         imgError={imgError}
         setImgError={setImgError}
         setImgLoading={setImgLoading}
         onSelectImage={handleSelectImage}
         fileInputRef={fileInputRef}
         onFileChange={handleFileChange}
        />

        <div className="pt-20 text-brown-primary text-sm font-secondary font-medium text-start">
         <p>Tamanho do arquivo: no máximo 1 MB</p>
         <p>Extensão de arquivo: JPEG, PNG</p>
        </div>
       </div>
       <DeleteUser onDelete={openModal} />
     </div>
    </div>
    <Modal title="Deseja excluir sua conta?" description="Ao excluir, todos os dados e informações serão apagados do sistema." isOpen={modalOpen} onClose={closeModal} onConfirm={handleDeleteUser} />
   </div>
  );
}
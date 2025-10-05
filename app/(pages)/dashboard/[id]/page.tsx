import Header from "@/app/components/dashboard/header"
import InfoPessoais from "@/app/components/dashboard/perfil-user/info-pessoais";

export default function Page(){

    return (
        <div className="h-screen">
            <Header />
            <InfoPessoais />
        </div>
    );
}
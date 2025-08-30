import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import InstagramArea from "@/app/components/landing/instagram-area";
import ExplanationBierbox from "@/app/components/quem-somos/explanation-bierbox";
import QuemSomosFoto from "@/app/components/quem-somos/quem-somos-foto";

export default function Page(){

    return(
        <div>
            <Header/>
            <QuemSomosFoto/>
            <ExplanationBierbox/>
            <InstagramArea/>
            <Footer/>
        </div>
    );
}
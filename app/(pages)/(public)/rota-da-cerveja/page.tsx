import BannersBierweg from "@/app/components/bierweg/banners-bierweg";
import ExplanationBierweg from "@/app/components/bierweg/explanation-bierweg";
import PhotosBierweg from "@/app/components/bierweg/photos-bierweg";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";

export default function Page(){

    return(
        <div>
            <Header/>
            <BannersBierweg/>
            <ExplanationBierweg/>
            <PhotosBierweg/>
            <Footer/>
        </div>
    );
}
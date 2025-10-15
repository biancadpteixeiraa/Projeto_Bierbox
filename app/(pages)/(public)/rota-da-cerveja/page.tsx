import ExplanationBierweg from "@/app/components/bierweg/explanation-bierweg";
import MapaBierweg from "@/app/components/bierweg/mapa-bierweg";
import PhotosBierweg from "@/app/components/bierweg/photos-bierweg";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";

export default function Page(){

    return(
        <div>
            <Header/>
            <MapaBierweg/>
            <ExplanationBierweg/>
            <PhotosBierweg/>
            <Footer/>
        </div>
    );
}
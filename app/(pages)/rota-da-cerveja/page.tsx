import ExplanationBierweg from "@/app/components/bierweg/explanation-bierweg";
import InstagramBierweg from "@/app/components/bierweg/instagram-bierweg";
import MapaBierweg from "@/app/components/bierweg/mapa-bierweg";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";

export default function Page(){

    return(
        <div>
            <Header/>
            <MapaBierweg/>
            <ExplanationBierweg/>
            <InstagramBierweg/>
            <Footer/>
        </div>
    );
}
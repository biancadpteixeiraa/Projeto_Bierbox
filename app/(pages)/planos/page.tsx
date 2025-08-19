import BannerArea from "@/app/components/common/banner-area";
import BenefitsArea from "@/app/components/common/benefits-area";
import ExplanationArea from "@/app/components/common/explanation-area";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import PlansBanner from "@/app/components/planos/plans-banner";
import PlansCards from "@/app/components/planos/plans-cards";

export default function Page(){

    return(
        <div>
            <Header/>
            <PlansBanner/>
            <PlansCards/>
            <div className="h-[500px]">
            </div>
            <BannerArea/>
            <div className="h-[100px]"></div>
            <BenefitsArea/>
            <ExplanationArea/>
            <div className="h-[100px]"></div>
            <Footer/>
        </div>
    );
}
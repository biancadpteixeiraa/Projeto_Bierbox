import BannerArea from "@/app/components/common/banner-area";
import BenefitsArea from "@/app/components/common/benefits-area";
import ExplanationArea from "@/app/components/common/explanation-area";
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import { PlansCarousel } from "@/app/components/common/plans-carousel";
import PlansBanner from "@/app/components/planos/plans-banner";
import PlansCards from "@/app/components/planos/plans-cards";

export default function Page(){

    return(
        <div>
            <Header/>
            <PlansBanner/>
            <PlansCards/>
            <PlansCarousel className="">
                <div className="h-full w-full flex items-center justify-center gap-6 p-6">
                    <div className="bg-blue-300 h-full w-full flex items-center justify-center">Plano 1</div>
                    <div className="bg-yellow-300 h-full w-full flex items-center justify-center">Plano 1</div>
                </div>
                <div className="h-full w-full flex items-center justify-center gap-6 p-6">
                    <div className="bg-pink-300 h-full w-full flex items-center justify-center">Plano 2</div>
                    <div className="bg-gray-300 h-full w-full flex items-center justify-center">Plano 2</div>
                </div>
                <div className="h-full w-full flex items-center justify-center gap-6 p-6">
                    <div className="bg-purple-300 h-full w-full flex items-center justify-center">Plano 3</div>
                    <div className="bg-red-300 h-full w-full flex items-center justify-center">Plano 3</div>
                </div>
                <div className="h-full w-full flex items-center justify-center gap-6 p-6">
                    <div className="bg-green-300 h-full w-full flex items-center justify-center">Plano 4</div>
                    <div className="bg-orange-300 h-full w-full flex items-center justify-center">Plano 4</div>
                </div>
            </PlansCarousel>
            <BannerArea/>
            <div className="h-[100px]"></div>
            <BenefitsArea/>
            <ExplanationArea/>
            <div className="h-[100px]"></div>
            <Footer/>
        </div>
    );
}
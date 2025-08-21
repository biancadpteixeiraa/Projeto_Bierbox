import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import { PlansCarousel } from "@/app/components/common/plans-carousel";



export default function Page(){

    return(
        <div>
            <Header/>
            <PlansCarousel className="">
                <div className="bg-red-300 h-full w-full flex items-center justify-center">Plano 1</div>
                <div className="bg-green-300 h-full w-full flex items-center justify-center">Plano 2</div>
                <div className="h-full w-full flex items-center justify-center gap-6 p-6">
                    <div className="bg-blue-300 h-full w-full flex items-center justify-center">Plano 3</div>
                    <div className="bg-yellow-300 h-full w-full flex items-center justify-center">Plano 3</div>
                </div>
            </PlansCarousel>
            <Footer/>
        </div>
    );
}
"use client"
import Footer from "@/app/components/common/footer";
import Header from "@/app/components/common/header";
import BoxArea from "@/app/components/planos-detalhes/box-area";
import BoxDetails from "@/app/components/planos-detalhes/box-details-area";
import PlansCards from "@/app/components/planos/plans-cards";
import PlansCarouselArea from "@/app/components/planos/plans-carousel-area";


export default function Page(){ 

    
    return( 
        <div> 
            <Header/>
            <BoxArea/>
            <BoxDetails/>
            <PlansCards label="Conheça outros planos!"/>
            <PlansCarouselArea/>
            <Footer/> 
        </div> 
        ); 
}
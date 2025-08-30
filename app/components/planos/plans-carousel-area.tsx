import Link from "next/link";
import { PlansCarousel } from "../ui/plans-Carousel/plans-carousel";
import Button from "../ui/button";
import PriceCard from "../ui/price-card";

export default function PlansCarouselArea() {

    const plans = [
        {
            annualValue: "400,00",
            monthlyValue:"40,00",
            path: "planos/plano1",
            src:"/post.png"
        },
        {
            annualValue: "100,00",
            monthlyValue:"100,00",
            path: "planos/plano2",
            src:"/post.png"
        },{
            annualValue: "300,00",
            monthlyValue:"30,00",
            path: "planos/plano3",
            src:"/post.png"
        },{
            annualValue: "600,00",
            monthlyValue:"60,00",
            path: "planos/plano4",
            src:"/post.png"
        },
    ]

    return(
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
            <PlansCarousel className="w-full">
                {plans.map((plan, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center justify-center lg:flex-row gap-6 lg:gap-10 xl:gap-14 w-full"
                >
                    {/* Container da imagem com responsividade melhorada */}
                    <div className="flex-shrink-0 w-full max-w-sm lg:max-w-none lg:w-auto">
                        <img
                            src={plan.src}
                            alt={`Plano ${index + 1}`}
                            className="w-full h-auto max-w-[300px] lg:max-w-[400px] xl:w-[450px] mx-auto lg:mx-0 object-cover rounded-lg"
                        />
                    </div>
                    
                    {/* Container dos cards de preço */}
                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full lg:w-auto justify-center lg:justify-start">
                        {/* Card Plano Anual */}
                        <PriceCard className="w-full sm:w-auto sm:min-w-[280px]" label="melhor custo benefício!">
                            <h1 className="text-base lg:text-xl text-start uppercase text-brown-tertiary font-primary pb-3 lg:pb-4">
                                Plano <br /> Anual!
                            </h1>
                            <p className="text-yellow-primary font-secondary pb-4 lg:pb-6 xl:pb-10">
                                <span className="text-sm lg:text-base">R$</span>
                                <span className="text-2xl lg:text-3xl xl:text-4xl font-extrabold px-1 lg:px-2">{plan.annualValue}</span>
                                <span className="text-sm lg:text-base">/ANO</span>
                            </p>
                            <Link href={plan.path}>
                                <Button variant="secondary" className="w-full font-semibold py-2 lg:py-3 text-sm lg:text-base">
                                    Eu quero!
                                </Button>
                            </Link>
                        </PriceCard>
                        
                        {/* Card Plano Mensal */}
                        <PriceCard className="w-full sm:w-auto sm:min-w-[280px]" label="sem fidelidade!">
                            <h1 className="text-base lg:text-xl text-start uppercase text-brown-tertiary font-primary pb-3 lg:pb-4">
                                Plano <br /> Mensal!
                            </h1>
                            <p className="text-yellow-primary font-secondary pb-4 lg:pb-6 xl:pb-10">
                                <span className="text-sm lg:text-base">R$</span>
                                <span className="text-2xl lg:text-3xl xl:text-4xl font-extrabold px-1 lg:px-2">{plan.monthlyValue}</span>
                                <span className="text-sm lg:text-base">/MÊS</span>
                            </p>
                            <Link href={plan.path}>
                                <Button variant="secondary" className="w-full font-semibold py-2 lg:py-3 text-sm lg:text-base">
                                    Eu quero!
                                </Button>
                            </Link>
                        </PriceCard>
                    </div>
                </div>
                ))}
            </PlansCarousel>
        </div>
    );
}

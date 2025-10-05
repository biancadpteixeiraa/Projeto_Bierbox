"use client";
import Link from "next/link";
import { PlansCarousel } from "../ui/plans-Carousel/plans-carousel";
import Button from "../ui/button";
import PriceCard from "../ui/price-card";
import { useEffect, useState } from "react";
import { getBoxes } from "@/app/services/boxes";
import { PlansCarouselSkeleton } from "../ui/skeletons";

export default function PlansCarouselArea() {


    const [boxes, setBoxes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
        
    useEffect(() => {
        getBoxes().then((data) => {
        if (data.success) setBoxes(data.boxes);
        console.log(data);
        setLoading(false);
        });
    }, 
    []);

    return(
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-28">
            {loading && <PlansCarouselSkeleton/>}
            <PlansCarousel className="w-full">
                {boxes.map((box, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center justify-center lg:flex-row gap-6 lg:gap-10 xl:gap-14 w-full"
                >
                    <div className="flex-shrink-0 w-full max-w-sm lg:max-w-none lg:w-auto">
                        <img
                            src={'/post.png'}
                            alt={`Plano ${index + 1}`}
                            className="w-full h-auto max-w-[300px] lg:max-w-[400px] xl:w-[450px] mx-auto lg:mx-0 object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 w-full lg:w-auto justify-center lg:justify-start">
                        <PriceCard className="w-full sm:w-auto sm:min-w-[280px]" label="melhor custo benefício!">
                            <h1 className="text-base lg:text-xl text-start uppercase text-brown-tertiary font-primary pb-3 lg:pb-6">
                                Plano <br /> Anual!
                            </h1>
                            <p className="text-yellow-primary font-secondary pb-4 lg:pb-6 xl:pb-10">
                                <span className="text-sm lg:text-base">R$</span>
                                <span className="text-2xl lg:text-3xl xl:text-4xl font-extrabold px-1 lg:px-2">{box.preco_anual_4_un}</span>
                                <span className="text-sm lg:text-base">/ANO</span>
                            </p>
                            <Link href={`/planos/${box.id}`}>
                                <Button variant="secondary" className="w-full font-semibold py-2 lg:py-3 text-sm lg:text-base">
                                    Eu quero!
                                </Button>
                            </Link>
                        </PriceCard>
                        <PriceCard className="w-full sm:w-auto sm:min-w-[280px]" label="sem fidelidade!">
                            <h1 className="text-base lg:text-xl text-start uppercase text-brown-tertiary font-primary pb-3 lg:pb-6">
                                Plano <br /> Mensal!
                            </h1>
                            <p className="text-yellow-primary font-secondary pb-4 lg:pb-6 xl:pb-10">
                                <span className="text-sm lg:text-base">R$</span>
                                <span className="text-2xl lg:text-3xl xl:text-4xl font-extrabold px-1 lg:px-2">{box.preco_mensal_4_un}</span>
                                <span className="text-sm lg:text-base">/MÊS</span>
                            </p>
                            <Link href={`/planos/${box.id}`}>
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

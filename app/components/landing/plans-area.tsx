"use client"
import Link from "next/link";
import Card from "../ui/card";
import Button from "../ui/button";
import { getBoxes } from "@/app/services/boxes";
import { Suspense, useEffect, useState } from "react";
import { CardSkeleton, CardsSkeleton } from "../ui/skeletons";

export default function PlansArea(){

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
        <div className="max-w-7xl mx-auto flex flex-col px-14 lg:px-46 py-14 text-brown-primary">
            <h1 className="text-center text-xl font-primary pb-14 uppercase">
                PLANOS DE ASSINATURA
            </h1>
            <div className="flex flex-col lg:flex-row items-center gap-14 justify-center">
                {loading && <CardsSkeleton/>}
                {
                    boxes.map((box)=>(
                        <Card className="w-56 max-h-72"
                        key={box.id}>
                            <h1 className="text-2xl font-primary pb-4 transition-all duration-300 group-hover:text-3xl">
                                {box.nome}
                            </h1>
                            <p className="text-lg font-secondary font-bold pb-1 transition-all duration-300 group-hover:text-xl">
                                R${box.preco_anual_4_un}/ANO
                            </p>
                            <p className="text-base font-secondary font-semibold pb-6 transition-all duration-300 group-hover:text-lg">
                                R${box.preco_mensal_4_un}/MÊS
                            </p>
                            <Link 
                                href={`/planos/${box.id}`}
                            >
                                <Button variant="secondary" className="w-full font-semibold py-2">
                                    Eu quero!
                                </Button>
                            </Link>
                        </Card>
                    ))
                }
            </div>
        </div>
    );
}
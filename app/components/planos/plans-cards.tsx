"use client"
import Link from "next/link";
import Card from "../ui/card";
import Button from "../ui/button";
import { useEffect, useState } from "react";
import { getBoxes } from "@/app/services/boxes";
import { PlansCardsSkeleton } from "../ui/skeletons";

export default function PlansCards({
    label,
    }: {
    label?: string;
} & React.HTMLAttributes<HTMLDivElement>){

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
        <div className="max-w-6xl mx-auto flex flex-col px-6 py-14 lg:pt-20 text-brown-primary lg:relative lg:z-10">
            <h1 className="text-center text-lg font-primary pb-14 uppercase">
                {label}
            </h1>
            <div className="flex flex-wrap lg:flex-row items-center gap-10 justify-center">
                {loading && <PlansCardsSkeleton/>}
                {
                    boxes.map((box)=>(
                        <Card className="max-w-96 p-4 bg-white rounded-md"
                        key={box.id}>
                            <h1 className="uppercase text-xl font-secondary font-semibold pb-2 transition-all duration-300 group-hover:text-2xl">
                                {box.nome}
                            </h1>
                            <p className="uppercase text-xs font-secondary font-medium pb-6 transition-all duration-300 group-hover:text-sm"> 
                                cerveja artesanal
                            </p>
                            <Link 
                                href={`/planos/${box.id}`}
                            >
                                <Button variant="secondary" className="w-full font-semibold py-2 uppercase text-sm rounded-3xl">
                                    Valor Promocional!
                                </Button>
                            </Link>
                        </Card>
                    ))
                }
            </div>
        </div>
    );
}
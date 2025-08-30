import Link from "next/link";
import Card from "../ui/card";
import Button from "../ui/button";

export default function PlansArea(){

    const plans = [
        {
            name:"Combo Bronze",
            annualValue: "R$00,00/ANO",
            monthlyValue:"R$00,00/MÊS",
            path: "planos/plano1"
        },
        {
            name:"Combo Prata",
            annualValue: "R$00,00/ANO",
            monthlyValue:"R$00,00/MÊS",
            path: "planos/plano2"
        },{
            name:"Combo Ouro",
            annualValue: "R$00,00/ANO",
            monthlyValue:"R$00,00/MÊS",
            path: "planos/plano3"
        },{
            name:"Combo Diamante",
            annualValue: "R$00,00/ANO",
            monthlyValue:"R$00,00/MÊS",
            path: "planos/plano4"
        },
    ]

    return(
        <div className="max-w-7xl mx-auto flex flex-col px-14 lg:px-46 py-14 text-brown-primary">
            <h1 className="text-center text-xl font-primary pb-14 uppercase">
                PLANOS DE ASSINATURA
            </h1>
            <div className="flex flex-col lg:flex-row items-center gap-14 justify-center">
                {
                    plans.map((plan)=>(
                        <Card className="w-56 max-h-72"
                        key={plan.path}>
                            <h1 className="text-2xl font-primary pb-4 transition-all duration-300 group-hover:text-3xl">
                                {plan.name}
                            </h1>
                            <p className="text-base font-secondary font-bold pb-1 transition-all duration-300 group-hover:text-lg">
                                {plan.annualValue}
                            </p>
                            <p className="text-xs font-secondary font-semibold pb-6 transition-all duration-300 group-hover:text-base">
                                {plan.monthlyValue}
                            </p>
                            <Link 
                                href={plan.path}
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
import Link from "next/link";
import Card from "../ui/card";
import Button from "../ui/button";

export default function PlansArea(){

    const plans = [
        {
            name:"Combo Bronze",
            monthlyValue: "R$00,00/ANO",
            annualValue:"R$00,00/MÊS",
            path: "/plano1"
        },
        {
            name:"Combo Prata",
            monthlyValue: "R$00,00/ANO",
            annualValue:"R$00,00/MÊS",
            path: "/plano2"
        },{
            name:"Combo Ouro",
            monthlyValue: "R$00,00/ANO",
            annualValue:"R$00,00/MÊS",
            path: "/plano3"
        },{
            name:"Combo Diamante",
            monthlyValue: "R$00,00/ANO",
            annualValue:"R$00,00/MÊS",
            path: "/plano4"
        },
    ]

    return(
        <div className="flex flex-col px-52 py-14 text-brown-primary">
            <h1 className="text-center text-2xl font-primary pb-14 uppercase">
                PLANOS DE ASSINATURA
            </h1>
            <div className="flex flex-col lg:flex-row items-center gap-10 justify-center">
                {
                    plans.map((plan)=>(
                        <Card
                        key={plan.path}>
                            <h1 className="text-2xl font-primary pb-3 transition-all duration-300 group-hover:text-[28px]">
                                {plan.name}
                            </h1>
                            <p className="text-lg font-secondary font-bold pb-2 transition-all duration-300 group-hover:text-xl">
                                {plan.annualValue}
                            </p>
                            <p className="text-sm font-secondary pb-8 transition-all duration-300 group-hover:text-base">
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
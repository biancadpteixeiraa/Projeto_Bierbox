import Link from "next/link";
import Card from "../ui/card";
import Button from "../ui/button";

export default function PlansCards(){

    const plans = [
        {
            name: "Combo Bronze",
            type: "cerveja artesanal",
            path: "/plano1"
        },
        {
            name: "Combo Prata",
            type: "cerveja artesanal",
            path: "/plano2"
        },{
            name: "Combo Ouro",
            type: "cerveja artesanal",
            path: "/plano3"
        },{
            name: "Combo Diamante",
            type: "cerveja artesanal",
            path: "/plano4"
        },
    ]

    return(
        <div className="flex flex-col px-52 py-14 text-brown-primary">
            <h1 className="text-center text-2xl font-primary pb-14 uppercase">
                escolha o box ideal para você!
            </h1>
            <div className="flex flex-col lg:flex-row items-center gap-10 justify-center">
                {
                    plans.map((plan)=>(
                        <Card className="max-w-96 p-4"
                        key={plan.path}>
                            <h1 className="uppercase text-lg font-secondary font-semibold pb-3 transition-all duration-300 group-hover:text-xl">
                                {plan.name}
                            </h1>
                            <p className="uppercase text-sm font-secondary pb-3 transition-all duration-300 group-hover:text-base"> 
                                {plan.type}
                            </p>
                            <Link 
                                href={plan.path}
                            >
                                <Button variant="secondary" className="w-full font-semibold py-2 uppercase text-base">
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
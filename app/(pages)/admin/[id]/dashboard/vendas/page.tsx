import VendasArea from "@/app/components/admin/dashboard/vendas/vendas-area";


export default function Page() {
    return(
        <div className="max-w-6xl h-full px-6 md:px-12 py-16">
            <h1 className="font-secondary text-2xl text-brown-tertiary font-bold">Vendas/Pedidos</h1>
            <VendasArea />
        </div>
    );
}